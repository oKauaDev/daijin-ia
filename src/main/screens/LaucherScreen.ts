import { BrowserWindow } from 'electron'
import { fileURLToPath } from 'url'
import icon from '../../../resources/icon.png?asset'

function LaucherScreen(): BrowserWindow {
  const mainWindow = new BrowserWindow({
    width: 800,
    frame: false,
    alwaysOnTop: true,
    center: true,
    resizable: false,
    transparent: true,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: fileURLToPath(new URL('../preload/index.mjs', import.meta.url)),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  return mainWindow
}

export default LaucherScreen
