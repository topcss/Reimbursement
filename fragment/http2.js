
const hostname = '127.0.0.1';
const port = 3000;

// Include it and extract some methods for convenience
const server = require('server');
const { get, post } = server.router;
const { header } = server.reply;  // OR server.reply;

// https://serverjs.io/documentation/#cors
const cors = [
    // 响应头设置
    ctx => header("Access-Control-Allow-Origin", "*"),
    ctx => header("Access-Control-Allow-Headers", "*"),
    // 响应类型
    ctx => header("Access-Control-Allow-Methods", "GET"),
    // 带 cookie 的跨域访问
    ctx => header("Access-Control-Allow-Credentials", "true"),
    ctx => ctx.method.toLowerCase() === 'options' ? 200 : false
];

const controller = [
    get('/', ctx => 'Hello world'),
    get('/get', ctx => {
        let text = decodeURIComponent(ctx.url.substring(5))
        let data = JSON.parse(text)

        console.log(data)

        return 'ok'
    }),
    post('/templist', ctx => {
        console.log(ctx.data);
        return 'ok';
    })
]


// Launch server with options and a couple of routes
server({ port: port }, cors, controller);

console.log(`Server running at http://${hostname}:${port}/`);


/**
 * 
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
    $.ajax({ url: "http://127.0.0.1:3000/get?" + encodeURIComponent(JSON.stringify([...dict])) })
});
 */