// Include it and extract some methods for convenience
const server = require('server');
const { header } = server.reply;  // OR server.reply;
var c = require('child_process');

const hostname = '127.0.0.1';

var Controller = require('./controller');


// https://serverjs.io/documentation/#cors
const cors = [
    // 响应头设置
    ctx => header("Access-Control-Allow-Origin", "*"),
    ctx => header("Access-Control-Allow-Headers", "*"),
    // 响应类型
    ctx => header("Access-Control-Allow-Methods", "GET"),
    // 带 cookie 的跨域访问
    ctx => header("Access-Control-Allow-Credentials", "true"),
    ctx => ctx.method.toLowerCase() === 'options' ? 200 : false
];


function Server(port) {
    server({ port: port }, cors, Controller);
    console.log(`Server running at http://${hostname}:${port}/`);
    // 使用默认浏览器打开
    c.exec(`start http://${hostname}:${port}/`);
}

module.exports = Server
