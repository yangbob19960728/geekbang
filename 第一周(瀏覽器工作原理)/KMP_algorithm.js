


function machine (string, matchString) {
    var prefixTable = function () {
        let table = [-1]; //前綴表弟一個值為-1
        for (let index = 0; index < matchString.length - 1; index++) {
            let a = matchString.split("").slice(0, index + 1).join("");
            let length = a.length;
            for (let stringIndex = length; 0 < stringIndex; stringIndex--) {
                let maxLength = stringIndex - 1;
                if (length < 2) {
                    table.push(0);
                    break;
                }
                preString = a.split("").slice(0, maxLength).join("");
                endString = a.split("").slice(maxLength * -1).join("");
                if (preString === endString) {
                    table.push(maxLength);
                    break;
                }
                if(maxLength === 1) {
                    table.push(0);
                    break;
                }
            }
        }
        return table;
    };
    const machineObject = {
        "end": function (s) {
            return this.end;
        },
        "match": function () {
            let state = this.start;
            for (const s of string) {
                state = state.call(this, s);
            }
            return state === this.end;
        },
        "start": null
        
    };
    var init = function () {
        const table = prefixTable();
        // console.log(table);
        for (let index = 0; index < table.length; index++) {
            let functionIndex = (index + 1).toString();
            let functionName = ("findNumber" + functionIndex).toString();
            let matchS = (matchString[index]).toString();
            if (index < 1) {
                machineObject.start = function (s) {
                    // console.log("run start");
                    // console.log("s", s);
                    // console.log("matchS", matchS);
                    return (s === matchS) ? machineObject[functionName] : machineObject.start;
                }
            }
            else {
                machineObject["findNumber" + index] = function (s) {
                    // console.log("run findNumber" + index);
                    // console.log("s", s);
                    // console.log("matchS", matchS);
                    return (s === matchS) ? ((index < table.length - 1) ? machineObject[functionName] : machineObject.end)
                                          : (table[index] > 0) ? machineObject["findNumber" + table[index]](s) : machineObject.start(s);
                }
            }
        }
        console.log(string + ((machineObject.match()) ? " 有匹配到字串 " : " 沒有匹配到字串 ") + matchString);
    }
    init();
}
machine("abababx", "abababx");
machine("abababasdabx", "abababx");
machine("abababababababababasdabx", "abababx");
machine("abced", "abcde");
machine("", "abababx");