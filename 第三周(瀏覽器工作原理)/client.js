const net = require("net");
const parser = require("./parser.js");
const images = require("images");

class Request {
    constructor(options) {
        this.method = options.method || "GET";
        this.host = options.host;
        this.port = options.port || "80";
        this.path = options.path || "/";
        this.headers = options.headers || {};
        this.body = options.body || {};
        if (!this.headers["Content-Type"]) {
            this.headers["Content-Type"] = "application/x-www-form-urlencoded";
        }
        if (this.headers["Content-Type"] === "application/json") {
            this.bodyText = JSON.stringify(this.body);
        }
        else if (this.headers["Content-Type"] === "application/x-www-form-urlencoded") {
            this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join("&")
        }
        this.headers["content-Length"] = this.bodyText.length;
    }
    send (connection) {
        return new Promise((resolve, reject) => {
            const parser = new ResponseParser;
            if (connection) {
                connection.write(this.toString());
            }
            else {
                connection = net.createConnection({
                    host: this.host,
                    port: this.port
                }, () => {
                    console.log("connection")
                    connection.write(this.toString())
                })
            }
            connection.on("data", (data) => {
                parser.receive(data.toString());
                if (parser.isFinished) {
                    console.log("回傳資料")
                    resolve(parser.response);
                    
                    connection.end();
                }
            });
            connection.on("error", (err) => {
                reject(err);
                connection.end();
            })
        })
    }

    toString () {
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}
\r
${this.bodyText}`
    }
}

class ResponseParser {
    constructor () {
        this.WAITING_STATUS_LINE = 0;
        this.WAITING_STATUS_LINE_END = 1;
        this.WAITING_HEADER_NAME = 2;
        this.WAITING_HEADER_SPACE = 3;
        this.WAITING_HEADER_VALUE = 4;
        this.WAITING_HEADER_LINE_END = 5;
        this.WAITING_HEADER_BLOCK_END = 6;
        this.WAITING_BODY = 7;

        this.current = this.WAITING_STATUS_LINE;
        this.statusLine = "";
        this.headers = {};
        this.headerName = "";
        this.headerValue = "";
        this.bodyParser = null;
    }

    get isFinished () {
        return this.bodyParser && this.bodyParser.isFinished;
    }
    get response () {
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
        return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            headers: this.headers,
            body: this.bodyParser.content.join("")
        }
    }
    receive (string) {
        for (let i = 0; i < string.length; i++) {
            this.receiveChar(string.charAt(i));
            
        }
    }
    receiveChar (char) {
        switch (this.current) {
            case this.WAITING_STATUS_LINE:
                if (char === "\r") {
                    this.current = this.WAITING_STATUS_LINE_END
                }
                else {
                    this.statusLine += char;
                }
                
                break;
            case this.WAITING_STATUS_LINE_END:
                if (char === "\n") {
                    this.current = this.WAITING_HEADER_NAME
                }
                break;
            case this.WAITING_HEADER_NAME:
                if (char === ":") {
                    this.current = this.WAITING_HEADER_SPACE
                }
                else if (char === "\r") {
                    this.current = this.WAITING_HEADER_BLOCK_END;
                    if (this.headers["Transfer-Encoding"] === "chunked") {
                        this.bodyParser = new TrunkBodyParser();
                    }
                }
                else {
                    this.headerName += char;
                }
                break;
            case this.WAITING_HEADER_SPACE:
                if (char === " ") {
                    this.current = this.WAITING_HEADER_VALUE;
                }

                break;
            case this.WAITING_HEADER_VALUE:
                if (char === "\r") {
                    this.current = this.WAITING_HEADER_LINE_END;
                    this.headers[this.headerName] = this.headerValue;
                    this.headerName = "";
                    this.headerValue = "";
                }
                else {
                    this.headerValue += char;
                }
                break;
            case this.WAITING_HEADER_LINE_END:
                if (char === "\n") {
                    this.current = this.WAITING_HEADER_NAME;
                }
                break;
            case this.WAITING_HEADER_BLOCK_END:
                if (char === "\n") {
                    this.current = this.WAITING_BODY;
                }
                break;
            case this.WAITING_BODY:
                // console.log(char);
                this.bodyParser.receiveChar(char);
                break;
            default:
                break;
        }
    }
}

class TrunkBodyParser {
    constructor () {
        this.WAITING_LENGTH = 0;
        this.WAITING_LENGTH_LINE_END = 1;
        this.READING_TRUNK = 2;
        this.WAITING_NEW_LINE = 3;
        this.WAITING_NEW_LINE_END = 4;
        this.length = 0;
        this.content = [];
        this.isFinished = false;
        this.current = this.WAITING_LENGTH;
    }

    receiveChar (char) {
        if (this.current === this.WAITING_LENGTH) {
            if (char === "\r") {
                if (this.length === 0) {
                    this.isFinished = true;
                }
                this.current = this.WAITING_LENGTH_LINE_END;
            }
            else {
                this.length *= 16;
                this.length += parseInt(char, 16);
            }
        }
        else if (this.current === this.WAITING_LENGTH_LINE_END) {

            if (char === "\n") {
                this.current = this.READING_TRUNK;
            }
        }
        else if (this.current === this.READING_TRUNK) {
            this.content.push(char);
            this.length--;
            if (this.length === 0) {
                this.current = this.WAITING_NEW_LINE;
            }
        }
        else if (this.current === this.WAITING_NEW_LINE) {
            if (char === "\r") {
                this.current = this.WAITING_NEW_LINE_END;
            }
        }
        else if (this.current === this.WAITING_NEW_LINE_END) {
            if (char === "\n") {
                this.current = this.WAITING_LENGTH;
            }
        }
    }


}

function render (viewport, element) { 
    if (element.style) {
        var img = images(element.style.width, element.style.height);

        if (element.style["background-color"]) {
            let color = element.style["background-color"] || "rgba(0, 0, ,0)";
            color.match(/rgba\((.*?),(.*?),(.*?)\)/);
            img.fill(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3));
            viewport.draw(img, element.style.left || 0, element.style.top || 0);
        }
    }

    if (element.children) {
        for (const child of element.children) {
            render(viewport, child);
        }
    }
 }


void async function () {
    let request = new Request({
        method: "POST",
        host: "127.0.0.1",
        port: "8080",
        path: "/",
        headers: {
            ["X-Foo2"]: "customed"
        },
        body: {
            name: "winter"
        }
    });
    let res = await request.send();
    // console.log("res");
    // console.log(res.body);
    let dom = parser.parserHTML(res.body);

    let viewport = images(800, 800);
    render(viewport, dom);
    viewport.save("viewport.jpg");
    // console.log(typeof dom);
    // console.log(JSON.stringify(dom, null, " "));
}();