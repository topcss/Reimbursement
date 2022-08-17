// "main": "index.js",
// 企业微信 报销自动处理逻辑
// 在本地用nodejs启动一个3000的服务，用于接受企业微信中get请求提交的数据。没解决到post跨域，所以用get传递数据。
// 在企业微信中，采用调试模式，构建js请求结构体。
// 将结构数据拿到nodejs中进行处理，包括生成文件夹，创建word，打印图片等步骤。

// 指定启动的端口
const port = 3000;

var Server = require('./src/server');

// 启动服务
Server(port)
