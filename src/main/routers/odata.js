const router = require('koa-router')();
import { app } from 'electron'
const { path1, path3 } = require('./../index.config.js')

const path = require('path');
const Datastore = require('nedb');//配置nedb

//新建数据库
// const pdatalib = new Datastore({
//     filename: path.join(path3, '/data/' + 'pdata.db'),
//     autoload: true
// });
const dbs = require("../newdb.js")
const odatalib = dbs.db.odatalib
const slibdata = dbs.db.slib
// import slibdata from "./slib.js"
// const { slibdata,slib } = require('./slib.js')
// console.log(dbs)


//1、清除所有数据
router.get('/api/odata/clrall', async (ctx, next) => {
    let deldata = await new Promise(function (resolve, reject) {
        odatalib.remove({}, { multi: true }, function (err, numRemoved) {
            console.log('删除数据', err, numRemoved)
            resolve(numRemoved)
        })
    });
    ctx.response.body = { num: deldata, msg: '数据已删除' };
    ctx.status = 200;
});
//2、增加一条数据
router.post('/api/odata/add', async (ctx, next) => {
    /*koa post请求ctx.request.body空获取不到的解决办法 
    header请求头添加Content-type: application/json*/
    console.log('收到的数据', ctx.request.body);
    let data = ctx.request.body;
    let newlib;
    newlib = await new Promise(function (resolve, reject) {
      odatalib.insert(data, function (err, docs) {
            // console.log('错误', err);
            resolve(docs)
        })
    });
    ctx.response.body = { data: newlib, msg: '添加成功' };
    ctx.status = 200;
});
//3 查询所有数据
router.get('/api/odata/query', async (ctx, next) => {
    let lib = await new Promise(function (resolve, reject) {
        odatalib.find({}).exec(function (err, docs) {
            // console.log(docs)
            resolve(docs)
        });
    });
    let c = await new Promise(function (resolve, reject) {
        odatalib.count({}, function (err, count) {
            // console.log(count)
            resolve(count)
        });
    });
    // console.log('列表', taglist);
    ctx.response.body = { msg: c + '条数据查询成功' ,data: lib};
    ctx.status = 200;
});

//4 条件查询数据，接受taskid查询，返回整条数据
router.get('/api/odata/search/', async (ctx, next) => {
    // console.log('收到的查询参数', ctx.request.body)
    console.log('收到的查询参数', ctx.query)//使用ctx.query可以获取？查询的参数
    let lib = await new Promise(function (resolve, reject) {
        odatalib.find({ taskid: ctx.query["0"] }).exec(function (err, docs) {
            resolve(docs)
        });
    });
    console.log('列表', lib);
    ctx.response.body = { data: lib, msg: '数据查询成功' };
    ctx.status = 200;
});
//5、清除一条数据
router.get('/api/odata/delete', async (ctx, next) => {
    console.log('收到的查询参数', ctx.query[0])//使用ctx.query可以获取？查询的参数
    let delonedata = await new Promise(function (resolve, reject) {
        odatalib.remove({_id:ctx.query[0]}, function (err, numRemoved) {
            console.log('删除数据', err, numRemoved)
            resolve(numRemoved)
        })
    });
    ctx.response.body = { num: delonedata, msg: '数据已删除' };
    ctx.status = 200;
});
//6、表单增加一条数据
router.post('/api/odata/formadd', async (ctx, next) => {
    /*koa post请求ctx.request.body空获取不到的解决办法 
    header请求头添加Content-type: application/json*/
    // console.log('收到的数据', ctx.request.body);
    let re = ctx.request.body;
    if(ctx.request.body.mem==""||ctx.request.body.date==""||ctx.request.body.task==""||ctx.request.body.q==""){
        ctx.response.body = { msg: '信息填写不全，请填写完整后再点击提交按钮' };
        ctx.status = 200;
    }
    else{
        let newlib;
        let tasks= re.task.split("/")
        let data = {}
        // console.log(tasks)
        data.人员=re.mem,
        data.时间=re.date
        data.工作类别=tasks[2]
        data.工作任务=tasks[3]
        data.任务编号=tasks[0]
        data.工作任务基准积分=tasks[1]
        data.工作完成质量系数=re.q
        data.最后积分=tasks[1]*re.q
        data.备注工作内容=re.mark
        // console.log(re.mem,re.date,tasks[2],tasks[3],tasks[0],tasks[1],re.q,tasks[1]*re.q,re.mark)
        // console.log(data)
        newlib = await new Promise(function (resolve, reject) {
        odatalib.insert(data, function (err, docs) {
                // console.log('错误', err);
                resolve(docs)
            })
        });
        ctx.response.body = { data: newlib, msg: '添加成功' };
        ctx.status = 200;
    }
    
});
module.exports = router