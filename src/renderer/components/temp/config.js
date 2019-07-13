const router = require('koa-router')();
import {app} from 'electron'
const path = require('path');
const Datastore = require('nedb');//配置nedb
const {path1,path3} = require('../index.config.js')
const config = new Datastore({
    filename: path.join(path3,'/data/'+'config.db'),
    autoload: true
});

//
router.post('/api/config/member', async (ctx, next) => {
    /*koa post请求ctx.request.body空获取不到的解决办法 
    header请求头添加Content-type: application/json*/
    console.log('收到的数据', ctx.request.body);
    let { formDynamic } = ctx.request.body;
    let newmember;
    newmember = await new Promise(function (resolve, reject) {
        config.remove({})
        // config.remove({},{ multi: true })//清空数据库接口
        config.insert({
            formDynamic:formDynamic
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


const router = require('koa-router')();
import {app} from 'electron'
const path = require('path');
const Datastore = require('nedb');//配置nedb
const {path1,path3} = require('../index.config.js')
const config = new Datastore({
    filename: path.join(path3,'/data/'+'config.db'),
    autoload: true
});

//修改设置1
//
// router.post('/api/config/date', async (ctx, next) => {
//     /*koa post请求ctx.request.body空获取不到的解决办法 
//     header请求头添加Content-type: application/json*/
//     console.log('收到的数据', ctx.request.body);
//     let { date,team,id } = ctx.request.body;
//     let newmonth;
//     newmonth = await new Promise(function (resolve, reject) {
//         config.remove({id:"flag"})
//         config.insert({
//             date: date,
//             team:team,
//             id:id
//         }, function (err, docs) {
//             // console.log('错误', err);
//             resolve(docs)
//             reject(err)
//         });
//     });
//     ctx.response.body = { data: newmonth, msg: '设置更新成功' };
//     ctx.status = 200;
// });

//修改设置12
//
//test
// router.post('/api/config/member', async (ctx, next) => {
//     /*koa post请求ctx.request.body空获取不到的解决办法 
//     header请求头添加Content-type: application/json*/
//     console.log('收到的数据', ctx.request.body);
//     let { member ,id} = ctx.request.body;
//     let newmember;
//     newmember = await new Promise(function (resolve, reject) {
//         config.remove({id:"fog"})
//         // config.remove({},{ multi: true })//清空数据库接口
//         config.insert({
//             member:member,
//             id:id
//         }, function (err, docs) {
//             // console.log('错误', err);
//             resolve(docs)
//             reject(err)
//         });
//     });
//     ctx.response.body = { data: newmember, msg: '成员设置更新成功' };
//     ctx.status = 200;
// });
//原始使用formDynamic的接收
router.post('/api/config/member', async (ctx, next) => {
    /*koa post请求ctx.request.body空获取不到的解决办法 
    header请求头添加Content-type: application/json*/
    console.log('收到的数据', ctx.request.body);
    let { formDynamic } = ctx.request.body;
    let newmember;
    newmember = await new Promise(function (resolve, reject) {
        config.remove({})
        // config.remove({},{ multi: true })//清空数据库接口
        config.insert({
            formDynamic:formDynamic
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


