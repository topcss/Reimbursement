// "main": "index.js",
// 企业微信 报销自动处理逻辑
// 在本地用nodejs启动一个3000的服务，用于接受企业微信中get请求提交的数据。没解决到post跨域，所以用get传递数据。
// 在企业微信中，采用调试模式，构建js请求结构体。
// 将结构数据拿到nodejs中进行处理，包括生成文件夹，创建word，打印图片等步骤。


// TODO：先安装依赖
// npm install puppeteer --save --registry=https://registry.npm.taobao.org
// npm install docx --save --registry=https://registry.npm.taobao.org
// npm install exceljs --save --registry=https://registry.npm.taobao.org
// npm install server --save --registry=https://registry.npm.taobao.org

// NodeJS程序打包成exe
// npm install -g pkg --registry=https://registry.npm.taobao.org
// pkg -t win index.js -o app.exe --public
// 打包之后，始终有问题，不解决了。就用源码跑吧。
 


// 1.先启动本服务 
// 2.在启用企业微信的调试模式，在控制台中粘贴运行 __qiyeweixin.js 中的代码即可。

// 指定启动的端口
const port = 3000;

var Server = require('./src/server');

// 启动服务
Server(port)
