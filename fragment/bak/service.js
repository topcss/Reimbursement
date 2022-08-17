const SavePng = require('./puppe');
const SaveDocx = require('./word');
const SaveExcel = require('./excel')
const Sleep = require('./utils/time')
const path = require("path")


async function GenerateKPI(data) {

    let promises = []

    for (const key in data) {
        if ('误餐费明细表' == key) continue

        let list = data[key]
        if (list.length == 0) continue

        // 先异步下载，再同步等到结果
        let fileNames = await Promise.all(list.map(token => SavePng(token)))

        // 按日期排序后，构建为路径
        const paths = fileNames.sort().map(text => path.resolve(`./output/screenshot${text}.png`))

        // 异步：保存截图到word文件中
        promises.push(SaveDocx(paths, path.resolve(`./output/${key}.docx`)))
    }

    // 制作误餐费明细表
    if (data['误餐费明细表']) {
        const templatePath = path.resolve('./template/误餐费明细表.xlsx')
        const outPath = path.resolve('./output/误餐费明细表.xlsx')

        promises.push(SaveExcel(templatePath, outPath, data['误餐费明细表']))
    }

    Promise.all(promises).then(() => {
        console.log('请求执行完成。');
    })
}



function GenerateKPI_Old(data) {
    // console.log(data)

    // 图片地址
    let dict = {}

    // 先下载截图
    for (const key in data) {
        if ('误餐费明细表' == key) continue

        let list = data[key]

        if (list.length == 0) continue

        dict[key] = []

        // 先保存截图，互联网下载
        list.forEach(token => SavePng(token).then(path => dict[key].push(path)));
    }

    // 延时8秒执行
    Sleep(8 * 1e3).then(() => {
        for (const key in dict) {
            // 按日期排序
            let list = dict[key].sort();

            console.log(`${key}(${list.length}): ${list}`);

            // 保存截图到word文件中
            SaveDocx(list.map(text => path.resolve(`./output/screenshot${text}.png`)),
                path.resolve(`./output/${key}.docx`))
        }
    })

    // 制作误餐费明细表
    SaveExcel(
        path.resolve('./template/误餐费明细表.xlsx'),
        path.resolve('./output/误餐费明细表.xlsx'),
        data['误餐费明细表'])
}


module.exports = GenerateKPI