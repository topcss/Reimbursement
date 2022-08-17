// 一、启动监听服务（若通过浏览器打开则忽略此步骤）
// 1. 安装nodejs环境
// 2. 下载服务所需依赖包，执行 install.bat
// 3. 启动服务，用于监听企业微信发过来的请求，执行 start.bat 
// 二、在企业微信发起请求
// 1. 打开企业微信，按快捷键 ctrl + alt + shift + D，进入调试模式
// 2. 企业微信主界面 -> 工作台 -> 审批，在审批页面上点鼠标右键，选择 Show Dev Tools 打开调试窗口。
// 3. 选择 Console 控制台选项卡，粘贴本文件所有内容，按回车执行代码。
// 4. 等待几秒后，从企业微信中发起请求到node服务中。
// 5. 在node服务中，会有请求日志。

// 获取日期
function getTimes(subMonth, day) {
    let date = new Date();
    let d = new Date(date.getFullYear(), date.getMonth() - subMonth, day);
    return Math.ceil(d.getTime() / 1e3);// 这是企业微信的算法
}

// ajax 的构建
function request(url, data) {
    return new Promise((resolve, reject) => {
        let options = {
            url: url,
            success: function (e) {
                if ((e = "string" == typeof e ? JSON.parse(e) : e).data && e.data) {
                    resolve(e.data)
                }
            },
            error: e => reject(e)
        }

        if (data) { options.data = data }

        $.ajax(options)
    })
}

// 获取查询模板类型的参数
async function getTemplates() {
    let dict = new Map(), url = "/wework_admin/approval/api/get_approval_filter_templist?lang=zh_CN&f=json&ajax=1&random=" + Math.random()
    let data = await request(url)
    data.template_list.forEach(n => dict.set(n.template_name, n.template_id));
    return dict
}

// 审批列表
async function getShenpiList(start_time, end_time, template_id, keyword) {
    let random = Math.random(), limit = 100,// 一般一个月不会超过100个审批单
        url = `/wework_admin/approval/api/get_approval_list?lang=zh_CN&f=json&ajax=1&random=${random}&termid=0&offset=0&limit=${limit}&filter=myapply&last_templateid=&keyword=${keyword}&creator_vid=&read_status=&sp_status=2&start_time=${start_time}&end_time=${end_time}&template_id=${template_id}`;
    let data = await request(url)
    return data.xcxdata
}

// 获取打印窗口的id
async function getToken(sp_no, sp_id, template_id) {
    let url = "/wework_admin/approval/generate_token",
        options = {
            sp_number: sp_no,
            sp_id: sp_id,
            template_id: template_id,
            lang: window.language,
            timeZoneInfo: { zone_offset: (new Date).getTimezoneOffset() / 60 }
        }
    let data = await request(url, options)
    return data.token
}

// 获取审批的详情
async function getShenpiDetail(sp_id, sp_no) {
    let url = `/wework_admin/approval/api/get_approval_detail?is_approval_v3=true&sp_id=${sp_id}&sp_no=${sp_no}&is_from=creator&timezone_offset=-8&filter=&lang=zh_CN&ajax=1&f=json&random=${Math.random()}`
    let data = await request(url)
    return data
}

// 解析逻辑
async function parseData(start_time, end_time, template_id, keyword, c_name, data) {
    let list = await getShenpiList(start_time, end_time, template_id, keyword)
    if (list.length > 0) {
        data[c_name] = []

        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            // 解决企业微信过滤时关键字和日期不能配合查询的问题
            // sp_no: "202207270083"
            let sp_no = Math.ceil(new Date(`${item.sp_no.substring(0, 4)}-${item.sp_no.substring(4, 6)}-${item.sp_no.substring(6, 8)}`).getTime() / 1e3)

            if ("已通过" == item.state && sp_no >= start_time && sp_no <= end_time) {
                let token = await getToken(item.sp_no, item.sp_id, template_id)
                data[c_name].push(token)
            }

            // 还需要生成Excel列表，走单独的结构
            if ('误餐补助申请' == c_name) {
                let res = await getShenpiDetail(item.sp_id, item.sp_no)

                let creator_name = res.creator_info.name
                let apply_time = res.meta_info.apply_time * 1e3
                let apply_data = res.data.apply_data.contents.find(x => x.title[0].text.includes("申请事由")).value.text

                data['误餐费明细表'].push([creator_name, apply_time, apply_data])
            }
        }
    }
}

async function main() {
    // 构建数据传递到本地服务中
    let data = {}

    let dict = await getTemplates()
    for (const row of dict) {
        let start_time, end_time, name = row[0], template_id = row[1];

        // 上个月
        start_time = getTimes(1, 1);
        end_time = getTimes(0, 1) - 1;

        switch (name) {
            case '周末工作餐费津贴':
                await parseData(start_time, end_time, template_id, '', '周末工作餐费津贴', data)
                break;
            case '费用申请':
                // 交通费
                await parseData(start_time, end_time, template_id, '交通', '交通费', data)

                // 通讯费
                await parseData(start_time, end_time, template_id, '通讯', '通讯费', data)

                // 商务招待费
                await parseData(start_time, end_time, template_id, '招待', '商务招待费', data)
                break;
            case '误餐补助申请':
                data['误餐费明细表'] = []

                await parseData(start_time, end_time, template_id, '', '误餐补助申请', data)
                break;
        }
    }

    console.log("http://127.0.0.1:3000/get?" + encodeURIComponent(JSON.stringify(data)));
    $.ajax({ url: "http://127.0.0.1:3000/get?" + encodeURIComponent(JSON.stringify(data)) })
}

// 执行
main()
