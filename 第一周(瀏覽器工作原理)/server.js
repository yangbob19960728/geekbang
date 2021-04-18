const http = require('http');
http.createServer((req, res) => {
    let body = [];
    req.on('error', (err) => {
        console.log(err);
    }).on('data', (chuck) => {
        console.log("chuck", chuck);
        console.log("typeof chuck", typeof(chuck));
        console.log("chuck toString");
        console.log("chuck length", chuck.length);
        console.log(chuck.toString());
        body.push(chuck);
    }).on('end', ()=> {
        // console.log(Buffer, typeof(Buffer));
        
        body = Buffer.concat(body).toString();
        // console.log("body", body);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(" Hello World\n");
    });
}).listen(8080);

console.log("server started");