const server = require('server');
const ReimbursementService = require('./service');
const { get } = server.router;
const { header } = server.reply;
const { ReadFile } = require('./utils/file')
const path = require('path');

const Controller = [
    get('/favicon.ico', () => 'ok'),
    get('/', () => {
        let text = ReadFile(path.resolve(`./__qiyeweixin.js`)).toString()

        return header({ 'Content-Type': 'text/plain;charset=UTF-8' }).status(200).send(text)
    }),
    get('/get', ctx => {
        console.log('开始执行请求，请稍后...');
        // 请求数据预处理
        let text = decodeURIComponent(ctx.url.substring(5))

        // 数据转换为对象
        let model = JSON.parse(text)

        // 调用报销服务
        ReimbursementService(model)

        return header({ 'Content-Type': 'text/plain;charset=UTF-8' }).status(200).send('ok')
    })
]

module.exports = Controller
