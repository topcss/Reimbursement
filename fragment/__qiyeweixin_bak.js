// 企业微信的js

// 延时
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 获取日期
function getTimes(subMonth, day) {
    let date = new Date();
    let d = new Date(date.getFullYear(), date.getMonth() - subMonth, day);
    return Math.ceil(d.getTime() / 1e3);// 这是企业微信的算法
}

// 获取查询模板类型的参数
function getTemplates() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "/wework_admin/approval/api/get_approval_filter_templist?lang=zh_CN&f=json&ajax=1&random=" + Math.random(),
            success: function (e) {
                if ((e = "string" == typeof e ? JSON.parse(e) : e).data && e.data.template_list) {
                    let dict = new Map();
                    e.data.template_list.forEach(n => dict.set(n.template_name, n.template_id));
                    resolve(dict);
                }
            },
            error: e => reject(e)
        });
    });
}


async function getShenpiList(start_time, end_time, template_id, keyword) {
    return new Promise((resolve, reject) => {
        let random = Math.random(), limit = 100,// 一般一个月不会超过100个审批单
            url = `/wework_admin/approval/api/get_approval_list?lang=zh_CN&f=json&ajax=1&random=${random}&termid=0&offset=0&limit=${limit}&filter=myapply&last_templateid=&keyword=${keyword}&creator_vid=&read_status=&sp_status=2&start_time=${start_time}&end_time=${end_time}&template_id=${template_id}`;
        $.ajax({
            url: url,
            success: function (e) {
                if ((e = "string" == typeof e ? JSON.parse(e) : e).data && e.data.xcxdata) {
                    resolve(e.data.xcxdata);
                }
            },
            error: e => reject(e)
        });
    });
}




// 基础函数
async function getToken(sp_no, sp_id, template_id) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "/wework_admin/approval/generate_token",
            data: {
                sp_number: sp_no,
                sp_id: sp_id,
                template_id: template_id,
                lang: window.language,
                timeZoneInfo: {
                    zone_offset: (new Date).getTimezoneOffset() / 60
                }
            },
            success: function (e) {
                if ((e = "string" == typeof e ? JSON.parse(e) : e).data && e.data.token) {
                    resolve(e.data.token);
                }
            },
            error: e => reject(e)
        })
    })
}

// 获取审批的详情
async function getShenpiDetail(sp_id, sp_no) {
    return new Promise((resolve, reject) => {
        let random = Math.random(),
            url = `/wework_admin/approval/api/get_approval_detail?is_approval_v3=true&sp_id=${sp_id}&sp_no=${sp_no}&is_from=creator&timezone_offset=-8&filter=&lang=zh_CN&ajax=1&f=json&random=${random}`;
        $.ajax({
            url: url,
            success: function (e) {
                if ((e = "string" == typeof e ? JSON.parse(e) : e).data && e.data) {
                    resolve(e.data);
                }
            },
            error: e => reject(e)
        });
    });
}


async function parseData(start_time, end_time, template_id, keyword, c_name, data) {
    await getShenpiList(start_time, end_time, template_id, keyword)
        .then(list => {
            if (list.length > 0) {
                data[c_name] = []

                list.forEach(item => {
                    // 随机延时打开
                    sleep(parseInt(Math.random() * 1e3 * 1.5))
                        .then(() => {
                            // 解决企业微信过滤时关键字和日期不能配合查询的问题
                            // sp_no: "202207270083"
                            let sp_no = Math.ceil(new Date((item.sp_no + '').substring(0, 8)
                                .replace(/\d{2}/g, x => '-' + x)
                                .replace('-', '').replace('-', '')).getTime() / 1e3)
                            // state: "已通过"
                            // if ('通讯' == keyword) {
                            //     console.log('通讯');
                            //     if ("已通过" == item.state && sp_no >= start_time && sp_no <= end_time) {
                            //         console.log('通讯:ok');
                            //     }
                            //     console.log(item);
                            // }
                            if ("已通过" == item.state && sp_no >= start_time && sp_no <= end_time) {
                                getToken(item.sp_no, item.sp_id, template_id).then(id => data[c_name].push(id))
                            }

                            // 还需要生成Excel列表，走单独的结构
                            if ('误餐补助申请' == c_name) {
                                // console.log('误餐补助申请', item.sp_id, item.sp_no);
                                getShenpiDetail(item.sp_id, item.sp_no).then(res => {
                                    let creator_name = res.creator_info.name
                                    let apply_time = res.meta_info.apply_time * 1000
                                    let apply_data = res.data.apply_data.contents.find(x => x.title[0].text.includes("申请事由")).value.text
                                    console.log([creator_name, apply_time, apply_data]);

                                    data['误餐费明细表'].push([creator_name, apply_time, apply_data])
                                })
                            }
                        })
                })
            }
        })
}


// start_time: 1656604800
// end_time: 1659283199
// 构建数据传递到本地服务中
let data = {}

getTemplates()
    .then(dict => {
        for (const row of dict) {
            let start_time, end_time, name = row[0], template_id = row[1];

            // 上个月
            start_time = getTimes(1, 1);
            end_time = getTimes(0, 1) - 1;

            switch (name) {
                case '周末工作餐费津贴':
                    parseData(start_time, end_time, template_id, '', '周末工作餐费津贴', data)
                    break;
                case '费用申请':
                    // 交通费
                    parseData(start_time, end_time, template_id, '交通', '交通费', data)

                    // 通讯费
                    parseData(start_time, end_time, template_id, '通讯', '通讯费', data)

                    // 商务招待费
                    parseData(start_time, end_time, template_id, '招待', '商务招待费', data)
                    break;
                case '误餐补助申请':
                    data['误餐费明细表'] = []

                    parseData(start_time, end_time, template_id, '', '误餐补助申请', data)
                    break;
            }
        }

        // 延时2秒执行
        sleep(5 * 1e3)
            .then(() => {
                console.log("http://127.0.0.1:3000/get?" + encodeURIComponent(JSON.stringify(data)));
                $.ajax({ url: "http://127.0.0.1:3000/get?" + encodeURIComponent(JSON.stringify(data)) })
            })
    })
