const SavePng = require('./puppe');
const SaveDocx = require('./word');
const SaveExcel = require('./excel')
const path = require("path")
const { MakeDir } = require('./utils/file')

/**
 * 报销服务
 * @param {数据对象} model 
 */
async function ReimbursementService(model) {

    let promises = []
    let root = path.resolve('./output')

    for (const key in model) {
        let list = model[key]
        if (list.length == 0) continue

        switch (key) {
            case 'user':
                // 根据用户名称建文件夹
                let user = model[key]

                // 创建用户目录
                let sj = new Date(), folder = `${user}-${sj.getFullYear()}.${sj.getMonth().toString().padStart(2, '0')}`
                root = path.join(root, folder)
                MakeDir(root)
                break;

            case '误餐费明细表':
                // 制作误餐费明细表的处理逻辑
                const templatePath = path.resolve('./template/误餐费明细表.xlsx')
                const outPath = path.join(root, '误餐费明细表.xlsx')

                // 异步：保存到excel文件中
                promises.push(SaveExcel(templatePath, outPath, model[key]))
                break;

            default:
                // 审批申请单的处理逻辑

                // 先异步下载，再同步等到结果
                let fileNames = await Promise.all(list.map(token => SavePng(token, root)))

                // 按日期排序后，构建为路径
                const paths = fileNames.sort().map(text => path.join(root, `screenshot${text}.png`))

                // 异步：保存截图到word文件中
                promises.push(SaveDocx(paths, path.join(root, `${key}.docx`)))
                break;
        }
    }

    await Promise.all(promises)
    console.log('请求执行完成。');
}

module.exports = ReimbursementService