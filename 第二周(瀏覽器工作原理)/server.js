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
            }
            body #container img#form-img.l-img.l-img-response {
                max-width: 100%;
                background-color: blue;
            }
            #box {
                width: 200px;
                background-color: yellow;
            }
            .box {
                border: 5px solid green;
                background-color: green;
            }

        </style>
    </head>
    <body class="custom cat">
        asdasd
        <div id="container">
            <div id="box" class="box">Box~~~~ 1231 23 12312313</div>
            <div class="box">111111111</div>
            <img src="xxxxxxxxxxxxx" id="form-img" class="l-img l-img-response" style="background-color: blue;"/>3
        </div>
    </body>
</html>
                `);
        console.log("已送資料");
    });
}).listen(8080);

console.log("server started");