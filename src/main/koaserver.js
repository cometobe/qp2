const Koa = require('koa');
const server = new Koa();
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const koaBody = require('koa-body');
const fs = require('fs');
const path = require('path');
const {path1,path3} = require('./index.config.js')


//新建数据库
const Datastore = require('nedb');//配置nedb

//新建数据库
// const db = {pdatalib : new Datastore({
//     filename: path.join(path3, '/data/' + 'pdata.db'),
//     autoload: true
// }),
// slib : new Datastore({
//     filename: path.join(path3, '/data/' + 'slib.db'),
//     autoload: true
// }),


// }


//静态资源
const serve = require("koa-static");
// server.use(serve(__dirname + '/' + "public"),
//     console.log('server1'+__dirname + '/' + "public"));
server.use(serve( path.join(path3 + '/data/' + 'upload')),
    // console.log('server2'+ path.join(path3 + '/data/' + 'upload'))
);
// server.use(serve(path.join('/data'),'/'),console.log(path.join('/data')));


server.use(async (ctx, next) => {
    // console.log(`请求的URL${ctx.request.url}`);
    await next()
})

// 进行requestbody解析
server.use(bodyParser());//用koa-body替代会有415错误


// 加入路由
server.use(require('./routers/slib.js').routes());
server.use(require('./routers/config.js').routes());
server.use(require('./routers/pdata.js').routes());
server.use(require('./routers/fdata.js').routes());
server.use(require('./routers/sdata.js').routes());
server.use(require('./routers/odata.js').routes());
server.use(require('./routers/czdata.js').routes());
server.use(require('./routers/gzdata.js').routes());

server.use(koaBody({
    multipart: true,
    encoding: 'gzip',
    formidable: {
        maxFileSize: 200 * 1024 * 1024    // 设置上传文件大小最大限制，默认2M
    }
}));
router.post('/api/postimage', async (ctx, next) => {
    // console.log('ctx检查', ctx.request.file, ctx.request.body.file, ctx)
    // console.log(ctx.request.files.fileminiurl)
    // 上传单个文件
    const file = ctx.request.files.file; // 获取上传文件
    let prefix = new Date().format('yyyyMMddhhmmss').substr(0, 18)
    // 创建可读流
    const reader = fs.createReadStream(file.path);
    let filePath = path.join(path3, '/data/upload/') + prefix + '_' + `${file.name}`;
    // console.log('路径', filePath)
    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
    return ctx.body = {msg: file.name + "上传成功！", name: prefix + '_' + `${file.name}`};
});

server.use(router.routes());


server.listen(5000);//启动koa服务器
console.log('server started at port 5000...')

export {server}
