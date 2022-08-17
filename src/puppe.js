//引入puppeteer
const path = require('path');
const puppeteer = require('puppeteer');

// 获取截图的区域
async function getPosition(page, selector) {
    return await page.evaluate((el) => {
        const { left, top, width, height } = document.querySelector(el).getBoundingClientRect();
        return { left, top, width, height };
    }, selector)
}

async function callback(browser, token) {
    try {
        //创建一个Page实例
        const page = await browser.newPage();

        //打开审批打印页面
        await page.goto(`https://app.work.weixin.qq.com/wework_admin/approval/print?token=${token}&filter=myapply&from=wwapp`);

        // 修改样式，打印更紧凑
        await page.$eval('.approval_print', (el, value) => el.setAttribute('style', value), 'padding-top:0;')
        await page.$eval('.approval_print_qr', (el, value) => el.setAttribute('style', value), 'padding-bottom: 0;height: 70px;')

        const pos = await getPosition(page, '.approval_print');
        let text = await page.$eval('.approval_print_data td:nth-child(2)', el => el.innerText);

        const src = path.resolve(`./output/screenshot${text}.png`)

        //截图并在根目录保存
        await page.screenshot({
            path: src,
            type: 'png',
            clip: {
                x: pos.left,
                y: pos.top,
                width: pos.width,
                height: pos.height
            }
        })

        //关闭Chromium
        await browser.close()

        return text
    } catch (error) {
        console.log(error);
    }
}

// 将打印页面的内容保存为图片
function SavePng(token) {
    return new Promise((resolve, reject) => {
        // 不限制监听数量
        process.setMaxListeners(0)

        puppeteer.launch({
            headless: true,
            defaultViewport: null,
            args: ['--start-maximized'],
            ignoreDefaultArgs: ['--enable-automation'],
            // https://blog.csdn.net/cainiao1412/article/details/123459685
            // 由于puppeteer本身就是一个可执行程序，pkg不能将可执行程序一起打包，因此puppeteer代码可以这么写：
            // executablePath: path.resolve(`./node_modules/puppeteer/.local-chromium/win64-1022525/chrome-win/chrome.exe`)
        })
            .then(browser => resolve(callback(browser, token)))
            .catch(e => reject(e));
    })
}

module.exports = SavePng
