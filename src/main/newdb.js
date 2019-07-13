//新建数据库
const path = require('path');
const Datastore = require('nedb');//配置nedb
const { path1, path3 } = require('./index.config.js')

export const db = {
    
    slib: new Datastore({
        filename: path.join(path3, '/data/' + 'slib.db'),
        autoload: true
    }),
    config : new Datastore({
        filename: path.join(path3,'/data/'+'config.db'),
        autoload: true
    }),
    pdatalib: new Datastore({
        filename: path.join(path3, '/data/' + 'pdata.db'),
        autoload: true
    }),
    fdatalib: new Datastore({
        filename: path.join(path3, '/data/' + 'fdata.db'),
        autoload: true
    }),
    odatalib: new Datastore({
        filename: path.join(path3, '/data/' + 'odata.db'),
        autoload: true
    }),
    sdatalib: new Datastore({
        filename: path.join(path3, '/data/' + 'sdata.db'),
        autoload: true
    }),
    czdatalib: new Datastore({
        filename: path.join(path3, '/data/' + 'czdata.db'),
        autoload: true
    }),
    gzdatalib: new Datastore({
        filename: path.join(path3, '/data/' + 'gzdata.db'),
        autoload: true
    }),

}

