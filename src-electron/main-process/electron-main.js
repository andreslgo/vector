import { app, BrowserWindow, Menu, Tray } from 'electron'

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = require('path').join(__dirname, 'statics').replace(/\\/g, '\\\\')
}

let mainWindow
let tray = null

function createWindow () {
  /**
   * Initial window options
   */
  const iconPath = '/var/www/html/vectorquasar/icon.png'
  const iconPath2 = '/var/www/html/vectorquasar/icon2.png'
  tray = new Tray(iconPath)

  const trayContextMenu = Menu.buildFromTemplate([
      {label: 'Cambiar', click: () => {
        tray.setImage(iconPath2)    
      }},
      {label: 'Salir', click: (menuItem, mainWindow, event) => {
        app.quit()
      }}
  ])

  tray.setToolTip('This is my application.')
  tray.setContextMenu(trayContextMenu)

  
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
    icon: '/var/www/html/vectorquasar/icon.png'
  })

  mainWindow.loadURL(process.env.APP_URL)

  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()  
  })

  mainWindow.on('minimize',function(event){
      event.preventDefault()
      mainWindow.hide()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
