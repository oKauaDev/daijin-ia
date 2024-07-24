import { BrowserWindow, session } from 'electron'
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
      preload: fileURLToPath(new URL('../preload/index.js', import.meta.url)),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.loadFile('index.html')

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; connect-src 'self' https://api.openai.com https://api.naga.ac;"
        ]
      }
    })
  })

  return mainWindow
}

export default LaucherScreen
