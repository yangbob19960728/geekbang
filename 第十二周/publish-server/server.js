const http = require('http');
const https = require('https');

const fs =require('fs');

const unzipper = require('unzipper');

const querystring = require('querystring');



//2.auth路由: 接受code，用code + client_id + client_secret換token
function auth (req, res) {
    let query = querystring.parse(req.url.match(/^\/auth\?([\s\S]+)$/)[1]);
    // console.log(query);
    getToken(query.code, function (info) {
        console.log("123", info);
        res.write(`<a href="http://localhost:8083/?token=${info.access_token}">Publish</a>`);
        res.end();
     })
}

function getToken (code, callback) {
    let request = https.request({
        hostname: "github.com",
        path: `/login/oauth/access_token?code=${code}&client_id=Iv1.b0eb6c0766e13509&client_secret=07c4604685869e5de85ae88fac7a4a07463bc5d3`,
        port: 443,
        method: "POST",
    }, (res) => {
        let body = "";
        res.on('data', (chunk) => {
            body += chunk.toString();
        })

        res.on('end', () => {
            callback(querystring.parse(body))
        })
        // console.log(res);
    })
    request.end();
}




//4.publish路由: 用token獲取用戶訊息，檢查權限，接受發布
function publish (req, res) {
    let query = querystring.parse(req.url.match(/^\/publish\?([\s\S]+)$/)[1]);
    if (query.token) {
        getUser(query.token, info => {
                
            if (info.name === "yangbob19960728") {
                
                req.pipe(unzipper.Extract({path: '../server/public/'}));
                req.on('end', () => {
                    res.end("success!");
                })
            }
        });
    }
    
}

function getUser (token, callback) {
    let request = https.request({
        hostname: "api.github.com",
        path: `/user`,
        port: 443,
        method: "GET",
        headers: {
            Authorization: `token ${token}`,
            "User-Agent": "toy-bob-publish-homework"
        }
    }, (res) => {
        let body = "";
        res.on('data', (chunk) => {
            body += chunk.toString();
        })

        res.on('end', () => {
            console.log("body", body);
            callback(JSON.parse(body));
        })
        // console.log(err);
    })
    request.end();
}


http.createServer((req, res) => {
    console.log("request")

    if (req.url.match(/\/auth\?/i)) {
        return auth(req, res)
    }
    if (req.url.match(/\/publish\?/i)) {
        let outFile = fs.createWriteStream('../server/public/tmp.zip');
        req.pipe(outFile);
        return publish(req, res)
    }
}).listen(8082)