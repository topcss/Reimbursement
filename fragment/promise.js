//   "main": "./fragment/promise.js",

function print(num) {
    return new Promise((resolve, reject) => {
        resolve(num)
    })
}

function doPrint(ok) {
    return new Promise(res => {

        let list = []
        for (let i = 0; i < 10; i++) {
            list.push(print(i))
        }

        let aaa = Promise.all(list).then(x => { console.log('aaa', x) })
        console.log(aaa);
        let bbb = Promise.all(list).then(x => console.log('bbb', x))
        console.log(bbb);
        Promise.all([aaa, bbb]).then(x => {
            console.log('ccc')
            res(ok)
        })

    })
}
async function test() {
    console.log('71')
    await doPrint().then(function () {
        console.log(73);
    })
    console.log(74);
}
// test()

async function test2() {

    let list = []
    for (let i = 0; i < 10; i++) {
        list.push(print(i))
    }

    let cc = await Promise.all(list)
    console.log(typeof cc, cc.length, cc);

}
test2()




function getShenpiList(start_time, end_time, template_id, keyword) {
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

function request(url) {
    return new Promise((resolve, reject) =>
        $.ajax({
            url: url,
            success: function (e) {
                if ((e = "string" == typeof e ? JSON.parse(e) : e).data && e.data) {
                    resolve(e.data)
                }
            },
            error: e => reject(e)
        })
    )
}

async function getShenpiList(start_time, end_time, template_id, keyword) {
    let random = Math.random(), limit = 100,// 一般一个月不会超过100个审批单
        url = `/wework_admin/approval/api/get_approval_list?lang=zh_CN&f=json&ajax=1&random=${random}&termid=0&offset=0&limit=${limit}&filter=myapply&last_templateid=&keyword=${keyword}&creator_vid=&read_status=&sp_status=2&start_time=${start_time}&end_time=${end_time}&template_id=${template_id}`;

    return await request(url)
}

// getShenpiList(1656604800, 1659283199, 'Bs2jZvdRUYLn1PsDQzQHGWUqDpfaggCSB7vNzfxCV', '').then(x => console.log(x))
