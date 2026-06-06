import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'

process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

let win: BrowserWindow | null
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

function createWindow() {
  win = new BrowserWindow({
    title: '林业防火值班室综合管理系统',
    width: 1440,
    height: 900,
    minWidth: 1280,
    minHeight: 720,
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  if (url) {
    win.loadURL(url)
  } else {
    win.loadFile(indexHtml)
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

ipcMain.handle('open-file-dialog', async (_, options) => {
  const result = await dialog.showOpenDialog(win!, options)
  return result
})

ipcMain.handle('save-file-dialog', async (_, options) => {
  const result = await dialog.showSaveDialog(win!, options)
  return result
})
