import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ConfigInterface } from '../main/utils/Config'
import { ChatCompletionMessageParam } from 'openai/resources'

// Custom APIs for renderer
const api = {
  getConfig: () => ipcRenderer.invoke('get-config'),
  toggleAutoLaucher: () => ipcRenderer.invoke('toggle-auto-laucher'),
  proccessResponse: (history: ChatCompletionMessageParam[], prompt: string) =>
    ipcRenderer.invoke('proccess-response', history, prompt),
  setConfig: (key: keyof ConfigInterface, value: string) =>
    ipcRenderer.invoke('set-config', key, value),
  onClearHistory: (callback: () => void) => ipcRenderer.on('clear-history', callback)
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
