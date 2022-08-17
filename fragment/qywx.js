// 延时
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 获取日期
function getTimes(subMonth, day) {
    let date = new Date();
    let d = new Date(date.getFullYear(), date.getMonth() - subMonth, day);
    return Math.ceil(d.getTime() / 1e3);// 这是企业微信的算法
}

// 获取查询类型的参数
function getTypes() {
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

getTypes().then(dict => {
    console.log(dict);
});


getTypes().then(dict => {
    $.ajax({
        url: "http://127.0.0.1:3000/templist",
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify(dict)
    })
});

getTypes().then(dict => {
    console.log({ url: "http://127.0.0.1:3000/get?text=" + encodeURIComponent(JSON.stringify([...dict])) })
});
getTypes().then(dict => {
    $.ajax({ url: "http://127.0.0.1:3000/get?" + encodeURIComponent(JSON.stringify([...dict])) })
});


// 基础函数
function goPrint(sp_no, sp_id, template_id) {
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
                var i = location.origin + "/wework_admin/approval/print?token=" + e.data.token + "&filter=myapply&from=wwapp";
                window.wwapp.openDefaultBrowser({
                    data: {
                        url: i
                    }
                })
            }
        },
        error: function (e) { }
    })
}

function getShenpiList(start_time, end_time, template_id) {
    return new Promise((resolve, reject) => {
        let random = Math.random(), limit = 100,// 一般一个月不会超过100个审批单
            url = `/wework_admin/approval/api/get_approval_list?lang=zh_CN&f=json&ajax=1&random=${random}&termid=0&offset=0&limit=${limit}&filter=myapply&last_templateid=&keyword=&creator_vid=&read_status=&sp_status=2&start_time=${start_time}&end_time=${end_time}&template_id=${template_id}`;
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

// 类型列表
function print(cn_name) {
    getTypes()
        .then(dict => {
            for (const row of dict) {
                let start_time, end_time, name = row[0], template_id = row[1];

                if (cn_name != name) continue;

                if (['周末工作餐费津贴', '误餐补助申请'].includes(name)) {
                    // 从上上个月26号 到上个月25号
                    start_time = getTimes(2, 26);
                    end_time = getTimes(1, 25);
                } else if (['费用申请'].includes(name)) {
                    // 上个月
                    start_time = getTimes(1, 1);
                    end_time = getTimes(0, 1);
                }

                // 只打开需要打开的
                if (start_time && end_time) {
                    console.log(name, start_time, end_time, template_id);
                    getShenpiList(start_time, end_time, template_id)
                        .then(list => list.forEach(item => {
                            // 随机延时打开
                            sleep(parseInt(Math.random() * 1e3 * 1.5))
                                .then(() => goPrint(item.sp_no, item.sp_id, template_id))
                        }))
                    break;
                }
            }
        })
}

// 调用
print('周末工作餐费津贴')
print('误餐补助申请')
print('费用申请')

