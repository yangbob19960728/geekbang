const http = require('http');

const fs = require('fs');

const archiver = require('archiver');

const querystring = require('querystring');

let child_process = require('child_process');


// 1.打開 https://github.com/login/oauth/authorize
child_process.exec(`start https://github.com/login/oauth/authorize?client_id=Iv1.b0eb6c0766e13509`)

//3.創建server，接受token，後點擊發布
http.createServer((req, res) => {
    let query = querystring.parse(req.url.match(/^\/\?([\s\S]+)$/)[1]);
    console.log(query);
    publish(query.token)
}).listen(8083)

function publish (token) {
    const request = http.request({
        hostname: "127.0.0.1",
        port: 8082,
        method: "POST",
        headers: {
            'Content-Type': "application/octet-stream",
            // 'Content-Length': stats
        },
        path:"/publish?token=" + token
    }, (response) => {
        console.log("response", response);
    })
    
    const archive = archiver('zip', {
        zlib: {
            level: 9
        }
    });
    archive.directory('./sample/', false);
    archive.finalize();
    archive.pipe(request);
}






