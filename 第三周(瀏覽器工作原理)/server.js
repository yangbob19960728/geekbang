const http = require('http');
http.createServer((req, res) => {
    let body = [];
    req.on('error', (err) => {
        console.log(err);
    }).on('data', (chuck) => {
        // console.log("chuck", chuck);
        // console.log("typeof chuck", typeof(chuck));
        // console.log("chuck toString");
        // console.log("chuck length", chuck.length);
        // console.log(chuck.toString());
        body.push(chuck);
    }).on('end', ()=> {
        // console.log(Buffer, typeof(Buffer));
        
        body = Buffer.concat(body).toString();
        // console.log("body", body);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(`
<html lang=en>
    <head>
        <title>Document</title>
        <style>
            body {
                background-color: red;
            }

            body .l-img.l-img-response {
                background-color: red;
                flex-wrap: wrap;
            }
            body #container {
                display: flex;
                width: 800px;
                height: 800px;
                background-color: rgba(255, 255, 255);
                flex-wrap: wrap;
            }
            #box {
                width: 200px;
                height: 200px;
                background-color: rgba(255, 255, 0);
            }
            .box {
                width: 400px;
                height: 400px;
                border: 5px solid rgba(0, 255, 0);
                background-color: rgba(0, 255, 0);
            }
            .block {
                flex: 1;
                background-color: rgba(0, 0, 255);
            }
            #box2 {
                background-color: rgba(255, 0, 0);
            }

        </style>
    </head>
    <body class="custom cat">
        asdasd
        <div id="container">
            <div id="box" class="box"></div>
            <div class="box">111111111</div>
            <div class="block"></div>
            <div class="box" id="box2"></div>
        </div>
    </body>
</html>
                `);
        console.log("已送資料");
    });
}).listen(8080);

console.log("server started");