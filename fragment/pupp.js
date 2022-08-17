//引入puppeteer
const puppeteer = require('puppeteer');
 
const fs = require('fs');
const docx = require("docx");
const { Document, Packer, Paragraph, Media } = docx;


// 获取截图的区域
async function getPosition(page, selector) {
    return await page.evaluate((el) => {
        const { left, top, width, height } = document.querySelector(el).getBoundingClientRect();
        return { left, top, width, height };
    }, selector)
}

// 保存到word
async function saveDocx(imgePaths, wordPath) {
    const doc = new Document();

    const height = 465;
    const width = 600;

    let list = []
    for (let i = 0; i < imgePaths.length; i++) {
        const infile = imgePaths[i];

        const image = Media.addImage(doc, fs.readFileSync(infile), width, height);
        list.push(new Paragraph(image))
    }

    doc.addSection({ children: list });

    const b64string = await Packer.toBase64String(doc);
    const bs = Buffer.from(b64string, 'base64')

    var ws = fs.createWriteStream(wordPath)
    ws.write(bs)
    ws.end()
}



/*
创建一个Browser浏览器实例，并设置浏览器实例相关参数
headless: 是否在无头模式下运行浏览器，默认是true
defaultViewport：设置页面视口大小，默认800*600，如果为null的话就禁用视图口
args：浏览器实例的其他参数
defaultViewport: null, args: ['--start-maximized']：最大化视图窗口展示
ignoreDefaultArgs: ['--enable-automation']:
禁止展示chrome左上角有个Chrome正受自动软件控制，避免puppeteer被前端JS检测到
*/
puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ['--start-maximized'],
    ignoreDefaultArgs: ['--enable-automation']
}).then(async browser => {
    //创建一个Page实例
    const page = await browser.newPage();
    //打开百度首页
    await page.goto('https://app.work.weixin.qq.com/wework_admin/approval/print?token=d6649db98ce3454d4d42a9dd512cec4c&filter=myapply&from=wwapp');
    // await page.goto('https://www.baidu.com');
    // //定位输入框元素
    // const input_area = await page.$('#kw');
    // //在输入框元素中输入"hello world"
    // await input_area.type("hello world");
    // //定位搜索按钮元素
    // const search_btn = await page.$('#su');
    // //点击按钮元素
    // await search_btn.click();
    //等待3s
    // await page.waitForTimeout(1000);

    // 修改样式，打印更紧凑
    await page.$eval('.approval_print', (el, value) => el.setAttribute('style', value), 'padding-top:0;')
    await page.$eval('.approval_print_qr', (el, value) => el.setAttribute('style', value), 'padding-bottom: 0;height: 70px;')

    const pos = await getPosition(page, '.approval_print');
    let text = await page.$eval('.approval_print_data td:nth-child(2)', el => el.innerText);

    const src = `./output/screenshot${text}.png`
    console.log('保存图片：' + src);

    //截图并在根目录保存
    await page.screenshot({
        path: src,
        // path: 'baidu.png',
        type: 'png',
        clip: {
            x: pos.left,
            y: pos.top,
            width: pos.width,
            height: pos.height
        }
    });


    let wordPath = './a.docx'
    saveDocx([src], wordPath)


    //关闭Chromium
    await browser.close();
});

