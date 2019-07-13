import {app, BrowserWindow, remote,dialog} from 'electron'
import {server} from './koaserver.js'//启动koa server
const path = require('path');
const {path1,path3} = require('./index.config.js')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow;

const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;




function createWindow() {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        offscreen : true,
        backgroundColor: '#2e2c29',
        show: false,
        height: 700,
        useContentSize: true,
        width: 1000,
        webPreferences: {
            webSecurity: false,
            allowRunningInsecureContent: true,
            openDevTools:true
            // nodeIntegration: false
        },
    });

    mainWindow.loadURL(winURL);

    mainWindow.on('closed', () => {
        mainWindow = null
    });

// mainWindow.on('ready', () => {
//         dialog.showMessageBox({
//
// a1:path.join(app.getPath('userData'), '/data/'),
// a2:path.join(app.getAppPath(), '/data/'),
// a3:path.join(__dirname, '/data/'),
// a4:path.join('./', '/data/')
// })

    // });

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })
}

// var parseCommand = function() {
//  dialog.showMessageBox({
//    title  : '1'
//   , type  : 'info'
//   , message :path1,
//  });
//   dialog.showMessageBox({
//    title  : '2'
//   , type  : 'info'
//   , message :path3,
//  })
// }
//
// var initApp = function() {
//  parseCommand()
// }



// app.setPath('userData', path.join('e:/data'))
app.setName('量化绩效')
app.on('ready', createWindow);
// app.on('ready', initApp);


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
});


// console.log(remote.app.getPath('userData'))

// export const place = new Datastore({
//     filename: path.join(app.getPath('userData'),'/data/'+'place.db'),
//     autoload: true
// });
// export const todos = new Datastore({
//     filename: path.join(app.getPath('userData'),'/data/'+'todos.db'),
//     autoload: true
// });
// export const tags = new Datastore({
//     filename: path.join(app.getPath('userData'),'/data/'+'tags.db'),
//     autoload: true
// });