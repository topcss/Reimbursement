const Excel = require('exceljs');


async function SaveExcel(tmpPath, outPath, dataList) {
    // 创建一个workbook对象: 
    var workbook = new Excel.Workbook();

    await workbook.xlsx.readFile(tmpPath)
    let worksheet = workbook.worksheets[0];

    // 按日期降序排列
    dataList.sort((a, b) => b[1] - a[1])

    for (let i = 0; i < dataList.length; i++) {
        const row = dataList[i];

        // 插入行可以解决末列样式问题
        worksheet.insertRow(5, [dataList.length - i, new Date(row[1]), row[2], row[0], 0.5, 1, 20, ''], 'i');
    }

    worksheet.spliceRows(worksheet._rows.length, 1);

    // 在加载时强制工作簿计算属性
    workbook.calcProperties.fullCalcOnLoad = true;

    await workbook.xlsx.writeFile(outPath)
    console.log(`文件 ${outPath} 保存成功。`);
}

module.exports = SaveExcel

