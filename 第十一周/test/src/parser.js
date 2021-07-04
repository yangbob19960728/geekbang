
const layout = require("./layout.js");

const EOF = Symbol("EOF"); //EOF: End Of File
let stack;
let currentToken;
let currentAttribute;

let currentTextNode;


//加入一個新的函數,addCSSRules, 這裡我們把CSS規則暫存到一個陣列裡
let rules = [];
function addCSSRules (text) { 
    var ast = css.parse(text);
    rules.push(...ast.stylesheet.rules);
}

function matchElement(element, selector) { 
    if (!selector || !element.attributes)
    return false;
    selectorID = (selector.match(/\#(.*?)(\.|$)/)) ? selector.match(/\#(.*?)(\.|$)/)[1] : "";
    selectorClassGroups = (selector.match(/\.(.*?)(#|$)/)) ? selector.match(/\.(.*?)(#|$)/)[1] : "";
    selectorTagName = selector.replace("#" + selectorID, "").replace("." + selectorClassGroups, "");
    isMatch = true;
    if (selectorID != "") {
        let idGroups = selectorID.split("#");
        var attr = element.attributes.filter(attr => attr.name === "id").map(attr => attr.value);
        idGroups.forEach(id => {
            if (!attr.includes(id)) {
                isMatch = false;
            }
        });
        
    }
    if (selectorClassGroups != "") {
        let classGroups = selectorClassGroups.split(".");
        var elementClass = element.attributes.filter(attr => attr.name === "class").map(attr => attr.value);
        var elementClassGroup = (elementClass.length > 0) ? elementClass[0].split(" ") : elementClass;
        classGroups.forEach(c => {
            if (!elementClassGroup.includes(c)) {
                isMatch = false;
            }
        });
    }

    if (selectorTagName != "" && element.tagName != selectorTagName) {
        isMatch = false
    }
    return isMatch;
}

function specificity (selector) {
    let p = [0, 0, 0, 0];
    let selectorParts = selector.split(" ");
    for (const selector of selectorParts) {
        let selectorID = (selector.match(/\#(.*?)(\.|$)/)) ? selector.match(/\#(.*?)(\.|$)/)[1] : "";
        let selectorIDNumber = (selectorID != "") ? selectorID.split("#").length : 0;
        let selectorClassGroups = (selector.match(/\.(.*?)(#|$)/)) ? selector.match(/\.(.*?)(#|$)/)[1] : "";
        let selectorClassNumber = (selectorClassGroups != "") ? selectorClassGroups.split(".").length : 0;
        let selectorTagName = selector.replace("#" + selectorID, "").replace("." + selectorClassGroups, "");
        let selectorTagNameNumber = (selectorTagName != "") ? 1 : 0;
        p[1] += selectorIDNumber;
        p[2] += selectorClassNumber;
        p[3] += selectorTagNameNumber;
    }
    return p;
}

function compare (sp1, sp2) {
    if (sp1[0] - sp2[0])
        return sp1[0] - sp2[0];
    if (sp1[1] - sp2[1])
        return sp1[1] - sp2[1];
    if (sp1[2] - sp2[2])
        return sp1[2] - sp2[2];
    return sp1[3] - sp2[3];
}

function computeCSS (element) { 
    // console.log(rules);
    let elements = stack.slice().reverse();
    // console.log("compute CCS for Element", element);
    if (!element.computedStyle) {
        element.computedStyle = {};
    }
    for (const rule of rules) {
        var selectorParts = rule.selectors[0].split(" ").reverse();
        if (!matchElement(element, selectorParts[0]))
            continue;

        let matched = false;

        var j = 1;
        for (let i = 0; i < elements.length; i++) {
            if (matchElement(elements[i], selectorParts[j])) {
                j++;
            }
            
        }
        if (j >= selectorParts.length)
            matched = true;
        
        if (matched) {
            //如果匹配到，我們要加入
            let sp = specificity(rule.selectors[0]);
            // console.log(element);
            var computedStyle = element.computedStyle;
            for (const declaration of rule.declarations) {
                if (!computedStyle[declaration.property])
                computedStyle[declaration.property] = {}

                if (!computedStyle[declaration.property].specificity) {
                    computedStyle[declaration.property].value = declaration.value;
                    computedStyle[declaration.property].specificity = sp;
                }
                else if (compare(computedStyle[declaration.property].specificity, sp) < 0) {
                    computedStyle[declaration.property].value = declaration.value;
                    computedStyle[declaration.property].specificity = sp;
                }
            }
        }

    }
 }
function emit (token) {
    let top = stack[stack.length - 1];
    if (token.type == "startTag") {
        let element = {
            type: "element",
            children: [],
            attributes: []
        }

        element.tagName = token.tagName;

        for (const p in token) {
            if (p != "type" && p != "tagName" && p != "isSelfClosing") {
                element.attributes.push({
                    name: p,
                    value: token[p]
                });
                
            }
        }

        top.children.push(element);
        element.parent = JSON.parse(JSON.stringify(top));

        computeCSS(element);
        if (!token.isSelfClosing) {
            
            stack.push(element);
        }

        currentTextNode = null;
    }
    else if (token.type == "endTag") {
        if (top.tagName != token.tagName) {
            throw new Error("Tag start end doesn't match");

        }
        else {
            if (top.tagName === "style") {
                addCSSRules(top.children[0].content);
            }
            layout(top);
            stack.pop();
        }
        currentTextNode = null;
    }
    else if (token.type == "text") {
        if (currentTextNode == null) {
            currentTextNode = {
                type: "text",
                content: ""
            }
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }

 }

function data (c) { 
    if (c == "<") {
        return tagOpen;
    }
    else if (c == EOF) {
        emit({
            type: "EOF"
        });
        return ;
    }
    else {
        emit({
            type: "text",
            content: c
        });
        return data;
    }
 }

 function tagOpen (c) { 
    if (c == "/") {
        return endTagOpen;
    }
    else if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "startTag",
            tagName: ""
        }
        return tagName(c);
    }
    else {
        return data;
    }
  }

  function endTagOpen(c) { 
      if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "endTag",
            tagName: ""
        }
          return tagName(c);
      }
      else if (c == ">") {

      }
      else if (c == EOF) {

      }
      else {

      }
   }

   function tagName(c) { 
        if (c.match(/^[\t\n\f ]$/)) {
            return beforeAttributeName;
        }
        else if (c == "/") {
            return selfClosingStartTag;
        }
        else if (c.match(/^[a-zA-Z]$/)) {
            currentToken.tagName += c;
            return tagName;
        }
        else if (c == ">") {
            emit(currentToken);
            return data;
        }
        else {
            return tagName;
        }
    }

    function beforeAttributeName(c) { 
        if (c.match(/^[\t\n\f ]$/)) {
            return beforeAttributeName;
        }
        else if (c == ">" || c == "/" || c == EOF) {
            return afterAttributeName(c);
        }
        else if (c == "=") {
            
        }
        else {
            currentAttribute = {
                name: "",
                value: ""
            }
            return attributeName(c);
        }
     }

    function attributeName(c) { 
        if (c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF) {
            return afterAttributeName(c);
        }
        else if (c == "=") {
            return beforeAttributeValue;
        }
        else if (c == "\u0000") {

        }
        else if (c == "\"" || c == "'" || c == "<") {

        }
        else {
            currentAttribute.name += c;
            return attributeName;
        }
    }

    function beforeAttributeValue (c) { 
        if (c.match(/^[\t\n\f ]$/) || c =="/" || c == ">" || c == EOF) {
            return beforeAttributeValue;
        }
        else if (c == "\"") {
            return doubleQuotedAttributeValue;
        }
        else if (c == "\'") {
            return singleQuotedAttributeValue;
        }
        else if (c == ">") {
            // return data;
        }
        else {
            return UnquotedAttributeValue(c);
        }
     }

     function afterAttributeName (c) { 
        if (c.match(/^[\t\n\f ]$/)) {
            return afterAttributeName;
        }
        else if (c == "/") {
            return selfClosingStartTag;
        }
        else if (c == "=") {
            return beforeAttributeValue;
        }
        else if (c == ">") {
            currentToken[currentAttribute.name] = currentAttribute.value;
            emit(currentToken);
            return data;
        }
        else if (c == EOF) {
            // console.log("aaaa")
        }
        else {
            currentToken[currentAttribute.name] = currentAttribute.value;
            currentAttribute = {
                name: "",
                value: ""
            }
            return attributeName(c);
        }
     }

     function doubleQuotedAttributeValue (c) { 
        if (c == "\"") {
            currentToken[currentAttribute.name] = currentAttribute.value;
            return afterQuotedAttributeValue;
        }
        else if (c == "\u0000") {

        }
        else if (c == EOF) {
            // console.log("aaaa")
        }
        else {
            currentAttribute.value += c;
            return doubleQuotedAttributeValue
        }
      }

      function singleQuotedAttributeValue (c) { 
        if (c == "\'") {
            currentToken[currentAttribute.name] = currentAttribute.value;
            return afterQuotedAttributeValue;
        }
        else if (c == "\u0000") {

        }
        else if (c == EOF) {

        }
        else {
            currentAttribute.value += c;
            return doubleQuotedAttributeValue
        }
       }
    function UnquotedAttributeValue (c) { 
        if (c.match(/^[\t\n\f ]$/)) {
            currentToken[currentAttribute.name] = currentAttribute.value;
            return beforeAttributeName;
        }
        else if (c == "/") {
            currentToken[currentAttribute.name] = currentAttribute.value;
            return selfClosingStartTag;
        }
        else if (c == ">") {
            currentToken[currentAttribute.name] = currentAttribute.value;
            emit(currentToken);
            return data;
        }
        else if (c == "\u0000") {

        }
        else if (c == "\"" || c == "'" || c == "=" || c == "`") {

        }
        else if (c == EOF) {

        }
        else {
            currentAttribute.value += c;
            return UnquotedAttributeValue;
        }
        
     }

     function afterQuotedAttributeValue (c) { 
        if (c.match(/^[\t\n\f ]$/)) {
            return beforeAttributeName;
        }
        else if (c == "/") {
            return selfClosingStartTag;
        }
        else if (c == ">") {
            currentToken[currentAttribute.name] = currentAttribute.value;
            emit(currentToken);
            return data;
        }
        else if (c == EOF) {

        }
        else {
            throw new Error("unexpected character \"" + c + "\"");
        }
      }

     function selfClosingStartTag(c) {
        if (c == ">") {
            currentToken.isSelfClosing = true;
            emit(currentToken);
            return data;
        }
        else if (c == "EOF") {
            
        }
        else {
        }
     }







export function parserHTML (html) { 
    // console.log("解析html")
    stack = [{type: "document", children: []}];
    currentToken = null;
    currentAttribute = null;
    currentTextNode = null;

    let state = data;
    for (let c of html) {
        state = state(c);
    }
    state = state(EOF);
    // console.log(stack[0]);
    return stack[0]
}