const router = require('koa-router')();
import {app} from 'electron'
const dbs = require("../newdb.js")
const sdatalib = dbs.db.sdatalib
const slibdata = dbs.db.slib

//1、清除所有数据
router.get('/api/sdata/clrall', async (ctx, next) => {
    let deldata = await new Promise(function (resolve, reject) {
        sdatalib.remove({}, { multi: true }, function (err, numRemoved) {
            console.log('删除数据', err, numRemoved)
            resolve(numRemoved)
        })
    });
    ctx.response.body = { msg: '数据已删除', num: deldata };
    ctx.status = 200;
});
//2、增加一条数据
router.post('/api/sdata/add', async (ctx, next) => {
    /*koa post请求ctx.request.body空获取不到的解决办法 
    header请求头添加Content-type: application/json*/
    // console.log('收到的数据', ctx.request.body);
    let data = ctx.request.body;
    let newlib;
    newlib = await new Promise(function (resolve, reject) {
        let slibfind = new Promise(function (resolve, reject) {
            slibdata.find({任务编号:data["任务编号"]}).exec(function (err, docs) {
                if(docs.length > 0 ){
                    data["工作类别"] = docs[0].工作类别
                    data["工作任务"] = docs[0].工作任务
                    data["工作任务基准积分"] = docs[0].工作任务积分
                    data["最后积分"] = docs[0].工作任务积分
                    data["工作完成质量系数"] = "1"
                    console.log("查询id",data["任务编号"])
                }
                else{
                    console.log("查询id''",data["任务编号"])
                }
                resolve(docs)
                reject(err)
            });
        });
        // console.log(slibfind.then)
        slibfind.then(() => {sdatalib.insert(data, function (err, docs) {
            // console.log('错误', data["任务编号"]);
            resolve(docs)
            reject(err)
        })})
    });
    ctx.response.body = { data: newlib, msg: '添加成功' };
    ctx.status = 200;
});
//3 查询所有数据
router.get('/api/sdata/query', async (ctx, next) => {
    let lib = await new Promise(function (resolve, reject) {
        sdatalib.find({}).exec(function (err, docs) {
            resolve(docs)
        });
    });
    let c = await new Promise(function (resolve, reject) {
        sdatalib.count({}, function (err, count) {
            resolve(count)
        });
    });
    // console.log('列表', taglist);
    ctx.response.body = {  msg: c + '条数据查询成功' ,data: lib};
    ctx.status = 200;
});

//4 条件查询数据，接受taskid查询，返回整条数据
router.get('/api/sdata/search/', async (ctx, next) => {
    // console.log('收到的查询参数', ctx.request.body)
    console.log('收到的查询参数', ctx.query)//使用ctx.query可以获取？查询的参数
    let lib = await new Promise(function (resolve, reject) {
        sdatalib.find({ taskid: ctx.query["0"] }).exec(function (err, docs) {
            resolve(docs)
        });
    });
    console.log('列表', lib);
    ctx.response.body = { data: lib, msg: '数据查询成功' };
    ctx.status = 200;
});

module.exports = router