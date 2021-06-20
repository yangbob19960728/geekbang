export function createElement (type, attributes, ...children) {
    let element;
    if (typeof type === "string") {
        element = new ElementWrapper(type);
    }
    else {
        element = new type;
    }

    for (let name in attributes) {
        element.setAttribute(name, attributes[name])
    }
    for (let child  of children) {
        if (typeof child === "string") {
            child = new TextWrapper(child);
        }
        element.appendChild(child)
    }
    return element;
}

export class Component {
    constructor (type) {
    }

    setAttribute (name, value) {
        this.root.setAttribute(name, value);
    }

    mountTo (parent) {
        parent.appendChild(this.root);
    }

    appendChild (child) {
        child.mountTo(this.root);
    }
   
}

class TextWrapper extends Component {
    render(content){
        document.createTextNode(content);
    }
    
}

class ElementWrapper extends Component {
    render(type){
        return document.createElement(type)
    }
}