import { BrowserWindow } from 'electron'
import { fileURLToPath } from 'url'
import icon from '../../../resources/icon.png?asset'

function SettingsScreen(): BrowserWindow {
  const mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: fileURLToPath(new URL('../preload/index.mjs', import.meta.url)),
      sandbox: false
    }
  })

  mainWindow.setMenu(null)

  return mainWindow
}

export default SettingsScreen
