import { app, shell, BrowserWindow, ipcMain, Tray, Menu, globalShortcut } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import LaucherScreen from './screens/LaucherScreen'
import SettingsScreen from './screens/SettingsScreen'
import icon from '../../resources/icon.png?asset'
import Config, { ConfigInterface } from './utils/Config'
import AutoLaunch from 'auto-launch'
import Daijin from './ia/Daijin'

let mainWindow: BrowserWindow | null
let tray: Tray | null = null
let settingsWindow: BrowserWindow | null

const config = Config().get()

const appLauncher = new AutoLaunch({
  name: 'NomeDoSeuApp',
  path: app.getPath('exe')
})

function enableAutoLaunch() {
  appLauncher
    .enable()
    .then(() => {
      console.log('Auto-launch habilitado.')
    })
    .catch((err) => {
      console.error('Erro ao habilitar auto-launch:', err)
    })
}

function disableAutoLaunch() {
  appLauncher
    .disable()
    .then(() => {
      console.log('Auto-launch desabilitado.')
    })
    .catch((err) => {
      console.error('Erro ao desabilitar auto-launch:', err)
    })
}

const start_with_system = config.start_with_system === undefined ? true : config.start_with_system

if (start_with_system && !is.dev) {
  enableAutoLaunch()
}

function createLaucherWindow(): void {
  mainWindow = LaucherScreen()

  mainWindow.on('ready-to-show', () => {
    if (mainWindow) {
      mainWindow.show()
    }
  })

  mainWindow.on('blur', () => {
    if (mainWindow) {
      mainWindow.hide()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function createSettingsWindow(): void {
  settingsWindow = SettingsScreen()

  settingsWindow.on('ready-to-show', () => {
    if (settingsWindow) {
      settingsWindow.show()
    }
  })

  settingsWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  settingsWindow.on('closed', () => {
    settingsWindow = null
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    settingsWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/config.html')
  } else {
    settingsWindow.loadFile(join(__dirname, '../renderer/config.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.warn('pong'))

  ipcMain.handle('get-config', () => {
    const config = Config().get()
    return config
  })

  ipcMain.handle('set-config', (_event, key: keyof ConfigInterface, value: any) => {
    Config().set(key, value as any)

    return Config().get()
  })

  ipcMain.handle('toggle-auto-laucher', (_event) => {
    const config = Config().get()
    const start_with_system =
      config.start_with_system === undefined ? true : config.start_with_system

    if (!is.dev) {
      if (start_with_system) {
        enableAutoLaunch()
      } else {
        disableAutoLaunch()
      }
    }
  })

  ipcMain.handle('proccess-response', async (_event, history, prompt) => {
    const daijin = new Daijin(history, prompt)
    const response = await daijin.proccess()
    return response
  })

  createLaucherWindow()

  if (mainWindow) {
    mainWindow.hide()
  }

  tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Configurações',
      click: () => {
        if (settingsWindow) {
          settingsWindow.focus()
        } else {
          createSettingsWindow()
        }
      }
    },
    {
      label: 'Limpar histórico',
      click: () => {
        if (mainWindow) {
          mainWindow.webContents.send('clear-history')
        }
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.quit()
      }
    }
  ])

  tray.setToolTip('DaijinIA')
  tray.setContextMenu(contextMenu)

  globalShortcut.register('Alt+J', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide()
      } else {
        mainWindow.show()
      }
    }
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createLaucherWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
