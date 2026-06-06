import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  openFileDialog: (options: any) => ipcRenderer.invoke('open-file-dialog', options),
  saveFileDialog: (options: any) => ipcRenderer.invoke('save-file-dialog', options)
})
