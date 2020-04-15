// Basic init
const { app, BrowserWindow, Menu } = require('electron')
const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');
// Let electron reloads by itself when webpack watches changes in ./app/
require('electron-reload')(__dirname)

// To avoid being garbage collected
let mainWindow

app.on('ready', () => {

    installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    /*
    Menu.setApplicationMenu(Menu.buildFromTemplate([
        {
            label: 'File',
            submenu: [
                {
                    label: 'Load',
                    submenu: [
                        {
                            label: 'From File',
                            click: () => {

                            }
        
                        }
                    ]
                },
                {
                    label: 'CoinMarketCap'
                },
                {
                    label: 'Exit'
                }
            ]
        }
    ]));
*/
    mainWindow.loadURL(`file://${__dirname}/app/index.html`)

    mainWindow.maximize()
})
