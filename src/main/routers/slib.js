const router = require('koa-router')();

const { path1, path3 } = require('./../index.config.js')
// console.log(path3)
import { app } from 'electron'

const path = require('path');
const Datastore = require('nedb');//配置nedb
//导入数据库
const dbs = require("../newdb.js")
const pdatalib = dbs.db.pdatalib
const slibdata = dbs.db.slib
//1、清除所有数据
router.get('/api/lib/clrall', async (ctx, next) => {
    let deldata = await new Promise(function (resolve, reject) {
        slibdata.remove({}, { multi: true }, function (err, numRemoved) {
            console.log('删除数据', err, numRemoved)
            resolve(numRemoved)
        })
    });
    ctx.response.body = { msg: '数据已删除', num: deldata };
    ctx.status = 200;
});
//2、增加一条数据
//增加taskid数据唯一性检测，如果不唯一，返回提示消息
router.post('/api/lib/add', async (ctx, next) => {
    /*koa post请求ctx.request.body空获取不到的解决办法 
    header请求头添加Content-type: application/json*/
    // console.log('收到的数据', ctx.request.body);
    // let { task, taskid, taskcategory, reqhour, reqman, reqskill, workenvironment, risk, score, source, mark } = ctx.request.body;
    //工作任务、任务编号，任务类别、标准工时，人手，技能等级，环境、风险、积分，数据来源、备注
    let data = ctx.request.body
    //task,taskid,taskcategory,reqhour,reqman,reqskill,workenvironment,risk,score,source,mark
    let newlib;
    newlib = await new Promise(function (resolve, reject) {
        // slibdata.insert({
        //     task: task,
        //     taskid: taskid,
        //     taskcategory: taskcategory,
        //     reqhour: reqhour,
        //     reqman: reqman,
        //     mark: mark,
        //     reqskill: reqskill,
        //     workenvironment: workenvironment,
        //     risk: risk,
        //     score: score,
        //     source: source,
            slibdata.insert(data
        , function (err, docs) {
            console.log('错误', err);
            resolve(docs)
        });
    });
    ctx.response.body = { data: newlib, msg: '添加成功' };
    ctx.status = 200;
});
//3 查询所有数据
router.get('/api/lib/query', async (ctx, next) => {
    let lib = await new Promise(function (resolve, reject) {
        slibdata.find({}).sort({ 任务编号: 1 }).exec(function (err, docs) {
            resolve(docs)
        });
    });
    // console.log('列表', taglist);
    ctx.response.body = { slibdata: lib, msg: '数据查询成功' };
    ctx.status = 200;
});

//4 条件查询数据，接受taskid查询，返回整条数据
router.get('/api/lib/search/', async (ctx, next) => {
    // console.log('收到的查询参数', ctx.request.body)
    console.log('收到的查询参数', ctx.query)//使用ctx.query可以获取？查询的参数
    let lib = await new Promise(function (resolve, reject) {
        slibdata.find({ taskid: ctx.query["0"] }).exec(function (err, docs) {
            resolve(docs)
        });
    });
    console.log('列表', lib);
    ctx.response.body = { data: lib, msg: '数据查询成功' };
    ctx.status = 200;
});


//5、增加一些数据
router.post('/api/lib/adds', async (ctx, next) => {
    /*koa post请求ctx.request.body空获取不到的解决办法 
    header请求头添加Content-type: application/json*/
    // console.log('收到的数据', ctx.request.body);
    let data = ctx.request.body
    let newlib;
    newlib = await new Promise(function (resolve, reject) {
        for(let t in data){ 
            slibdata.insert(data[t]
                , function (err, docs) {
                    // console.log('错误', err);
                    resolve(docs)
                });
        }
            
    });
    ctx.response.body = {  msg: '标准库数据更新' };
    ctx.status = 200;
});

module.exports = router