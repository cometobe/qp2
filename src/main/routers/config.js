const router = require('koa-router')();
import {app} from 'electron'
// const path = require('path');
// const Datastore = require('nedb');//配置nedb
// const {path1,path3} = require('../index.config.js')
// const config = new Datastore({
//     filename: path.join(path3,'/data/'+'config.db'),
//     autoload: true
// });
//导入数据库
const dbs = require("../newdb.js")
const config = dbs.db.config
//
router.post('/api/config/member', async (ctx, next) => {
    /*koa post请求ctx.request.body空获取不到的解决办法 
    header请求头添加Content-type: application/json*/
    
    let  datares  = ctx.request.body;
    console.log('收到的数据', ctx.request.body,datares);
    let newmember;
    newmember = await new Promise(function (resolve, reject) {
        config.remove({})//清空之前的数据
        config.insert({
            formDynamic:datares.formDynamic
        }, function (err, docs) {
            // console.log('错误', err);
            resolve(docs)
            reject(err)
        });
    });
    ctx.response.body = { data: newmember, msg: '成员设置更新成功' };
    ctx.status = 200;
});

//2 查询所有数据
router.get('/api/config/query', async (ctx, next) => {
    let conf = await new Promise(function (resolve, reject) {
        config.find({}).exec(function (err, docs) {
            resolve(docs)
        });
    });
    console.log('查询conf', conf);
    ctx.response.body = { data: conf, msg: '数据查询成功' };
    ctx.status = 200;
});

module.exports = router