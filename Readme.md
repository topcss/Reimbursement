# 项目介绍

本项目是一个工具类，用于将企业微信中提交的审批单保存为Word用于打印。

## 为什么开源

本项目就功能而言，大部分人都不会用到，但作为一个nodejs服务项目的架构则有一定价值。

项目解决了几个问题。
1. 构建了分层架构的nodejs服务。自己有业务需要nodejs服务时，基于该架子可自行扩展业务功能。
2. 实现了通过无头浏览器获取网页元素，且将结果保存为图片。
3. 提供了异步转换为同步的几种方式，可以作为参考。
4. 实现了基于模板生成excel，有类似需求可自行扩展。
5. 实现了图片保存为word，有类似需求可自行扩展。

注意：本项目作为个人临时解决工作中问题的小项目，一定有很多不完善的地方，也不保证能解决你遇到的问题，请甄别使用。



试用前，先安装依赖。

执行 `install.bat` 安装依赖

或者执行以下命令安装
``` cmd
npm install puppeteer --save --registry=https://registry.npm.taobao.org
npm install docx --save --registry=https://registry.npm.taobao.org
npm install exceljs --save --registry=https://registry.npm.taobao.org
npm install server --save --registry=https://registry.npm.taobao.org
```
