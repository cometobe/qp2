const path = require('path');
import {app, BrowserWindow, remote,dialog} from 'electron'

const path1 = app.getPath('userData')
const path2 = app.getAppPath().split(path.sep)
// console.log(path2)
let path0 ='usrdata';
// for (let i = 0 ;i<path2.length-2;i++){
//     path3 = path.join(path3,path2[i])
// }

const path3 = process.env.NODE_ENV === 'development'
    ? path1
    : path0;

export {path1 ,path3}