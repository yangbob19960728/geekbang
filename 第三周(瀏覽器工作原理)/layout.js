
function getStyle (element) { 
    if (!element.style)
        element.style = {};

    for (const prop in element.computedStyle) {
        var p = element.computedStyle.value;
        element.style[prop] = element.computedStyle[prop].value;

        if (element.style[prop].toString().match(/px$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }
        if (element.style[prop].toString().match(/^[0-9]\.+$]/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }
    }

    return element.style;
 }

function layout(element) { 
    if (!element.computedStyle) {
        return ;
    }

    var elementStyle = getStyle(element);

    if (elementStyle.display !== "flex")
        return
    var items = element.children.filter(e => e.type === "element");
    items.sort(function (a, b) { 
        return (a.order || 0) - (b.order || 0);
    });

    var style = elementStyle;

    ['width', 'height'].forEach(size => {
        if (style[size] === "auto" || style[size] === "") {
            style[size] = null;
        }
    });

    if (!style["flex-direction"] || style["flex-direction"] == "auto")
        style["flex-direction"] = "row";

    if (!style["align-items"] || style["align-items"] == "auto")
        style["align-items"] = "stretch";

    if (!style["justify-content"] || style["justify-content"] == "auto")
        style["justify-content"] = "flex-start";

    if (!style["flex-wrap"] || style["flex-wrap"] == "auto")
        style["flex-wrap"] = "nowrap";

    if (!style["align-content"] || style["align-content"] == "auto")
        style["align-content"] = "stretch";

    var mainSize, mainStart, mainEnd, mainSign, mainBase,
        crossSize, crossStart, crossEnd, crossSign, crossBase;
    
    if (style["flex-direction"] === "row") {
        mainSize = "width";
        mainStart = "left";
        mainEnd = "right";
        mainSign = +1;
        mainBase = 0;

        crossSize = "height";
        crossStart = "top";
        crossEnd = "bottom";
    }

    if (style["flex-direction"] === "row-reverse") {
        mainSize = "width";
        mainStart = "right";
        mainEnd = "left";
        mainSign = -1;
        mainBase = style.width;

        crossSize = "height";
        crossStart = "top";
        crossEnd = "bottom";
    }

    if (style["flex-direction"] === "column") {
        mainSize = "height";
        mainStart = "top";
        mainEnd = "bottom";
        mainSign = +1;
        mainBase = 0;

        crossSize = "width";
        crossStart = "left";
        crossEnd = "right";
    }

    if (style["flex-direction"] === "column-reverse") {
        mainSize = "height";
        mainStart = "bottom";
        mainEnd = "top";
        mainSign = -1;
        mainBase = style.height;

        crossSize = "width";
        crossStart = "left";
        crossEnd = "right";
    }

    if (style["flex-wrap"] === "wrap-reverse") {
        let tmp = crossStart;
        crossStart = crossEnd;
        crossEnd = tmp;
        crossSign = -1;
    }
    else {
        crossBase = 0;
        crossSign = 1;
    }

    var isAutoMainSize = false;
    if (!style[mainSize]) { //auto sizing
        elementStyle[mainSize] = 0;
        for (let i = 0; i < items.length; i++) {
            var item = items[i];
            var itemStyle = getStyle(item);
            // console.log(item);
            if (itemStyle[mainSize] !== null || itemStyle[mainSize])
                elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize];
        }
        isAutoMainSize = true;
        // style["flex-wrap"] - "nowrap";
    }
    

    var flexLine = [];
    var flexLines = [flexLine];
    //剩餘空間
    var mainSpace = elementStyle[mainSize];
    var crossSpace = 0;

    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let itemStyle = getStyle(item);

        if (!itemStyle[mainSize]) {
            itemStyle[mainSize] = 0;
        }

        if (itemStyle.flex) {
            flexLine.push(item);
        }
        else if (style["flex-wrap"] === 'nowrap' || isAutoMainSize) {
            mainSpace -= itemStyle[mainSize];
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0))
                crossSpace = Math.max(crossSpace, itemStyle[crossSize])
            flexLine.push(item);
        }
        else {
            if (itemStyle[mainSize] > style[mainSize]) {
                itemStyle[mainSize] = style[mainSize];
            }
            if (mainSpace < itemStyle[mainSize]) {
                flexLine.mainSpace = mainSpace;
                flexLine.crossSpace = crossSpace;
                flexLine = [item];
                flexLines.push(flexLine);
                mainSpace = style[mainSize];
                crossSpace = 0;
            }
            else {
                flexLine.push(item);
            }

            if(itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0))
                crossSpace = Math.max(crossSpace, itemStyle[crossSize])
            mainSpace -= itemStyle[mainSize];
        }
        
    }
    flexLine.mainSpace = mainSpace;
    // console.log(items);

    if (style["flex-wrap"] === "nowrap" || isAutoMainSize) {
        flexLine.crossSpace = (style[crossSize] !== undefined) ? style[crossSize] : crossSpace;
    }
    else {
        flexLine.crossSpace = crossSpace;
    }

    if (mainSpace < 0) {
        let scale = style[mainSize] / (style[mainSize] - mainSpace);
        let currentMain = mainBase;

        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let itemStyle = getStyle(item);
            if (itemStyle.flex) {
                itemStyle[mainSize] = 0;
            }
            itemStyle[mainSize] = itemStyle[mainSize] * scale;
            itemStyle[mainStart] = currentMain;
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
            currentMain = itemStyle[mainEnd];
            
        }
    }
    else {
        flexLines.forEach(function (items) {
            var mainSpace = items.mainSpace;
            var flexTotal = 0;
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                let itemStyle = getStyle(item);

                if (itemStyle.flex !== null && (itemStyle.flex !== (void 0))) {
                    flexTotal += itemStyle.flex;
                    continue;
                }
                
            }
            if (flexTotal > 0) {
                let currentMain = mainBase;
                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    let itemStyle = getStyle(item);
                    if (itemStyle.flex) {
                        itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
                    }
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd];
                    
                }
            }
            else {
                //There is *NO* flexible flex items, which means, justifyContent should work
                if (style["justify-content"] === "flex-start") {
                    let currentMain = mainBase;
                    let step = 0;
                }
                if (style["justify-content"] === "flex-end") {
                    let currentMain = mainSpace * mainSign + mainBase;
                    let step = 0;
                }
                if (style["justify-content"] === "center") {
                    var currentMain = mainSpace / 2 * mainSign + mainBase;
                    let step = 0;  
                }
                if (style["justify-content"] === "space-between") {
                    var step = mainSpace / (item.length - 1) * mainSign;
                    var currentMain = mainBase;
                }

                if (style["justify-content"] === "space-around") {
                    var step = mainSpace / item.length * mainSign;
                    var currentMain = step / 2 + mainBase; 
                }
                for (let i = 0; i < items.length; i++) {
                    var item = items[i];
                    let itemStyle = getStyle(item);
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd] + step;
                    
                }
            }
        })
    }

    //computed the cross axis sizes
    //align-items, align-self
    var crossSpace;
    if (!style[crossSize]) {
        crossSpace = 0;
        elementStyle[crossSize] = 0;
        for (let i = 0; i < flexLines.length; i++) {
            elementStyle[crossSize] = elementStyle[crossSize] + flexLines[i].crossSpace;
        }
    }
    else {
        crossSpace = style[crossSize];
        for (let flexLineItem = 0; flexLineItem < flexLines.length; flexLineItem++) {
            crossSpace -= flexLines[flexLineItem].crossSpace;
            
        }
    }

    if (style["flex-wrap"] === "wrap-reverse") {
        crossBase = style[crossSize];
    }
    else {
        crossBase = 0;
    }
    var lineSize = style[crossSize] / flexLines.length;

    var step;
    if (style["align-content"] === "flex-start") {
        crossBase += 0;
        step = 0;
    }
    if (style["align-content"] === "flex-end") {
        crossBase += crossSign * crossSpace;
        step = 0;
    }

    if (style["align-content"] === "center") {
        crossBase += crossSign * crossSpace / 2;
        step = 0;
    }

    if (style["align-content"] === "space-between") {
        crossBase +=0;
        step = crossSpace / (flexLines.length - 1);
    }

    if (style["align-content"] === "space-around") {
        step = crossSpace / (flexLines.length);
        crossBase += crossSign * step / 2;
    }
    if (style["align-content"] === "stretch") {
       crossBase += 0;
       step = 0;
    }
    flexLines.forEach(function (items) { 
        var lineCrossSize = style["align-content"] === "stretch" ?
            items.crossSpace + crossSpace / flexLines.length :
            items.crossSpace;
        for (let i = 0; i < items.length; i++) {
            var item = items[i];
            var itemStyle = getStyle(item);
            var align = itemStyle.alignSelf || style["align-items"];

            if (!itemStyle[crossSize]) {
                itemStyle[crossSize] = (align === "stretch") ?
                lineCrossSize: 0;

            }
            if (align === "flex-start") {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            }

            if (align === "flex-end") {
                itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
                itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
            }

            if (align === "center") {
                itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            }

            if (align === "stretch") {
                itemStyle[crossStart] = crossBase;

                // itemStyle[crossEnd] = crossBase + crossSign * ((itemStyle[crossSize] != null && itemStyle[crossSize]) ? lineCrossSize : )
                itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
                itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);
            }
        }
        crossBase += crossSign * (lineCrossSize +  step);
     });
    //  console.log(items)
}


 module.exports = layout;