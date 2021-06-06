
class XRegExp {
    constructor(source, flag, root = "root") {
        this.table = new Map();
        this.regexp = new RegExp(this.compileRegExp(source, root, 0).source, flag);
        // console.log(this.regexp);
        // console.log(this.table);
    }
    compileRegExp(source, name, start) {
        if (source[name] instanceof RegExp) {
            return {
                source: source[name].source,
                length: 0
            };
        }
        let length = 0;

        let regexp = source[name].replace(/\<([^>]+)\>/g, (str, $1) => {
            this.table.set(start + length, $1);
            ++length;

            let r = this.compileRegExp(source, $1, start + length);
            length += r.length;
            return "(" + r.source + ")";
        })
        return {
            source: regexp,
            length: length
        };
    }
    exec (string) {
        let r = this.regexp.exec(string);
        // console.log(JSON.stringify(r))
        for (let i = 1; i < r.length; i++) {
            if (r[i] !== void 0) {
                // console.log(this.table.get(i - 1))
                r[this.table.get(i - 1)] = r[i];
            }
        }
        
        return r
    }
    get lastIndex() {
        return this.regexp.lastIndex; 
    }
    set lastIndex (value) {
        return this.regexp.lastIndex = value;
    }


}
let regexpAll = {
    InputElement:"<Whitespace>|<LineTerminator>|<Comments>|<Token>",
    Whitespace: / /,
    LineTerminator: /\n/,
    Comments: /\/\*(?:[^*]|\*[^\/])*\*\/|\/\/[^\n]*/,
    Token: "<Literal>|<Keywords>|<Identifer>|<Punctuator>",
    Literal: "<NumericLiteral>|<BooleanLiteral>|<StringLiteral>|<NullLiteral>",
    NumericLiteral:/0b[01]+|0o[0-7]+|0x[0-9A-Fa-f]+|(?:[1-9][0-9]*|0)(?:\.[0-9]*)?|\.[0-9]+/,
    BooleanLiteral: /true|false/,
    StringLiteral: /\"(?:[^"\n]|\\[\s\S])*\"|\'(?:[^'\n]|\\[\s\S])*\'/,
    NullLiteral: /null/,
    Identifer: /[a-zA-Z_$][a-zA-Z0-9_$]*/,
    Keywords: /break|continue|if|else|for|function|var|let|new|while/,
    Punctuator: /\|\||\&\&|\+|\-|\(|\=|\<|\+\+|\=\=|\=\>|\*|\.|\)|\[|\]|;|\{|\}|\?|\:|\,|\+|;/
};

export function* scan(str) { 
    // console.log("scan")
    let regexp = new XRegExp(regexpAll, "g", "InputElement");

    while(regexp.lastIndex < str.length) {
        let r = regexp.exec(str);
        // yield r
        // console.log(r);
        if (r.Whitespace) {

        }
        else if (r.LineTerminator) {

        }
        else if (r.Comments) {

        }
        else if (r.NumericLiteral) {
            yield {
                type: "NumericLiteral",
                value: r[0]
            }
        }
        else if (r.BooleanLiteral) {
            yield {
                type: "BooleanLiteral",
                value: r[0]
            }
        }
        else if (r.StringLiteral) {
            yield {
                type: "StringLiteral",
                value: r[0]
            }
        }
        else if (r.NullLiteral) {
            yield {
                type: "NullLiteral",
                value: null
            }
        }
        else if (r.Identifer) {
            yield {
                type: "Identifier",
                name: r[0]
            }
        }
        else if (r.Keywords) {
            yield {
                type: r[0]
            }
        }
        else if (r.Punctuator) {
            yield {
                type: r[0]
            }
        }
        else {
            throw new Error("unexpected token" + r[0]);
        }

        if (!r[0].length)
            break;
    }
    yield {
        type: "EOF"
    }
}
    
// let source = (`
//     for (let i = 0; i < 3; i++) {
//         for (let j = 0; j < 3; j++) {
//             let cell = document.createElement("div");
//             cell.classList.add("cell");
//             cell.innerText = pattern[i * 3 + j] == 2 ? "asd" : pattern[i * 3 + j] == 1 ? "dsa" : "";
//             cell.addEventListener("click", ()=> userMove(j, i));
//             board.appendChild(cell);
//             if (true) {
                
//             }
//         }
//         board.appendChild(document.createdElement("br"))
//     }
// `);

