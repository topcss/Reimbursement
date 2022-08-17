
// https://github.com/exceljs/exceljs/blob/master/README_zh.md
const Excel = require('exceljs');

// 创建一个workbook对象: 
var workbook = new Excel.Workbook();

console.log('exceljs');


workbook.xlsx.readFile('./template/误餐费明细表.xlsx').then(function () {

    const worksheet = workbook.worksheets[0];
    const nameCol = worksheet.getColumn('B');

    worksheet.insertRow(5, [1, new Date(2022, 8, 11), '20047项目、加班错过就餐', 'Jack', 0.5, 1, 20, 'A'], 'i');
    // worksheet.addRow([1, new Date(2022,8,11), 'xxx', 'Jack', 0.5, 1, 20, 'A'], 'i');

    // worksheet.insertRow(1, [3, 'Sam', new Date()]);

    // 获取工作表中的最后一个可编辑行（如果没有，则为 `undefined`）
    const row = worksheet.lastRow;

     

    // 定位需要修改的位置 
    // workbook.model.sheets[0].rows[4].cells[0].value = 'asfasfd'
    // 序号	日期	事由	人员	天数	餐次	金   额\
    // let sheet = workbook.model.worksheets[0]

    workbook.xlsx.writeFile('./误餐费明细表2.xlsx').then(() => {
        console.log('重写完成')
    })
})


// "main": "./fragment/excel.js",