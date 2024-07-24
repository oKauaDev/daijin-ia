import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ConfigInterface } from '../main/utils/Config'

// Custom APIs for renderer
const api = {
  getConfig: () => ipcRenderer.invoke('get-config'),
  refreshPrompt: () => ipcRenderer.invoke('refresh-prompt'),
  setConfig: (key: keyof ConfigInterface, value: string) =>
    ipcRenderer.invoke('set-config', key, value)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
