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
const pdatalib = dbs.db.pdatalib
const slibdata = dbs.db.slib
const gzdatalib = dbs.db.gzdatalib
const odatalib = dbs.db.odatalib
const fdatalib = dbs.db.fdatalib
const sdatalib = dbs.db.sdatalib
const czdatalib = dbs.db.czdatalib
// import slibdata from "./slib.js"
// const { slibdata,slib } = require('./slib.js')
// console.log(dbs)


//1、清除所有数据
router.get('/api/pdata/clrall', async (ctx, next) => {
    let deldata = await new Promise(function (resolve, reject) {
        pdatalib.remove({}, { multi: true }, function (err, numRemoved) {
            console.log('删除数据', err, numRemoved)
            resolve(numRemoved)
        })
    });
    ctx.response.body = { num: deldata, msg: '数据已删除' };
    ctx.status = 200;
});
//2、增加一条数据
router.post('/api/pdata/add', async (ctx, next) => {
    /*koa post请求ctx.request.body空获取不到的解决办法 
    header请求头添加Content-type: application/json*/
    let data = ctx.request.body;

    // console.log('收到的数据', ctx.request.body,data["任务编号"]);
    let newlib;
    newlib = await new Promise(function (resolve, reject) {
        let slibfind = new Promise(function (resolve, reject) {
            slibdata.find({ "任务编号": data["任务编号"] }).exec(function (err, docs) {
                // console.log("查询id",data["任务编号"],docs)
                if (docs.length > 0) {
                    data["工作类别"] = docs[0].工作类别
                    data["工作任务"] = docs[0].工作任务
                    data["工作任务基准积分"] = docs[0].工作任务积分
                    data["最后积分"] = docs[0].工作任务积分
                    data["工作完成质量系数"] = "1"
                }
                else {
                    // console.log("查询id",data["任务编号"])
                }
                resolve(docs)
            });
        });
        // console.log(slibfind.then)
        slibfind.then(() => {
            pdatalib.insert(data, function (err, docs) {
                // console.log('错误', err);
                resolve(docs)
            })
        })
    });
    ctx.response.body = { data: newlib, msg: '添加成功' };
    ctx.status = 200;
});
//3 查询所有数据
router.get('/api/pdata/query', async (ctx, next) => {
    let lib = await new Promise(function (resolve, reject) {
        pdatalib.find({}).exec(function (err, docs) {
            resolve(docs)
        });
    });
    let c = await new Promise(function (resolve, reject) {
        pdatalib.count({}, function (err, count) {
            resolve(count)
        });
    });
    // console.log('列表', taglist);
    ctx.response.body = { msg: c + '条数据查询成功', data: lib };
    ctx.status = 200;
});

//4 条件查询数据，接受taskid查询，返回整条数据
router.get('/api/pdata/search/', async (ctx, next) => {
    // console.log('收到的查询参数', ctx.request.body)
    console.log('收到的查询参数', ctx.query)//使用ctx.query可以获取？查询的参数
    let q = ctx.query.month
    let m = ctx.query["m[]"]
    console.log(q, m)
    let plib = await new Promise(function (resolve, reject) {
        pdatalib.find({ "时间": { $regex: eval("/^" + q + "/") }, "人员": { $in: m } }).sort({ 人员: -1 }).exec(function (err, docs) {
            resolve(docs)
            reject(err)
            // console.log(err,docs)
        });

    });
    let gzlib = await new Promise(function (resolve, reject) {
        gzdatalib.find({ "时间": { $regex: eval("/^" + q + "/") }, "人员": { $in: m } }).sort({ 人员: -1 }).exec(function (err, docs) {
            resolve(docs)
            reject(err)
        });
        // console.log(err,docs)
    });
    let olib = await new Promise(function (resolve, reject) {
        odatalib.find({ "时间": { $regex: eval("/^" + q + "/") }, "人员": { $in: m } }).sort({ 人员: -1 }).exec(function (err, docs) {
            resolve(docs)
            reject(err)
        });
        // console.log(err,docs)
    });
    let flib = await new Promise(function (resolve, reject) {
        fdatalib.find({ "时间": { $regex: eval("/^" + q + "/") }, "人员": { $in: m } }).sort({ 人员: -1 }).exec(function (err, docs) {
            resolve(docs)
            reject(err)
        });
        // console.log(err,docs)
    });
    let slib = await new Promise(function (resolve, reject) {
        sdatalib.find({ "时间": { $regex: eval("/^" + q + "/") }, "人员": { $in: m } }).sort({ 人员: -1 }).exec(function (err, docs) {
            resolve(docs)
            reject(err)
        });
        // console.log(err,docs)
    });
    let czlib = await new Promise(function (resolve, reject) {
        czdatalib.find({ "时间": { $regex: eval("/^" + q + "/") }, "人员": { $in: m } }).sort({ 人员: -1 }).exec(function (err, docs) {
            resolve(docs)
            reject(err)
            // console.log(err,docs)
        });
    });
    let alldata = czlib.concat(slib, flib, olib, gzlib, plib)
    // console.log('列表', lib);
    ctx.response.body = { data: alldata, msg: '数据查询成功' };
    ctx.status = 200;
});

module.exports = router