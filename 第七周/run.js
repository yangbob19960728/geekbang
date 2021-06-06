import { Evaluator } from "./evaluator.js";
import { parse } from "./syntaxParser.js";

document.getElementById("run").addEventListener("click", function (event) {
    let r =new Evaluator().evaluate(parse(document.getElementById('source').value))
    console.log(event);
    console.log(r);
})