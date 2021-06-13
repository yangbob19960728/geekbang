import { Component, createElement } from "./framework.js";


class Carousel extends Component{
    constructor () {
        super();
        this.attributes = Object.create(null);
    }
    setAttribute (name, value) {
        this.attributes[name] = value;
    }
    render () { 
        console.log(this.attributes);
        this.root = document.createElement("div");
        this.root.classList.add("carousel");
        for (const record of this.attributes.src) {
            let child = document.createElement("div");
            child.style.backgroundImage = `url('${record}')`;
            
            this.root.appendChild(child)
        }
        let position = 0;
        this.root.addEventListener("mousedown", event => {
            console.log("mousedown");
            let children = this.root.children;
            let startX = event.clientX;

            let move = event => {
                let x = event.clientX - startX;
                let current = position - (x - x % 500)/ 500;
                for (const offset of [-1, 0, 1]) {
                    let pos = current + offset;
                    pos = (pos + children.length) % children.length;
                    children[pos].style.transition = "none";
                    children[pos].style.transform = `translate(${- pos * 500 + offset * 500 + x % 500}px, 0px)`;
                }
            }

            let up = event => {
                let x = event.clientX - startX;
                position = position - Math.round(x / 500);
                for (const offset of [0, - Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]) {
                    let pos = position + offset;
                    pos = (pos + children.length) % children.length;
                    children[pos].style.transition = "";
                    children[pos].style.transform = `translate(${- pos * 500 + offset * 500}px, 0px)`;
                }
                document.removeEventListener("mousemove", move);
                document.removeEventListener("mouseup", up);
                
            }
            document.addEventListener("mousemove", move);
            document.addEventListener("mouseup", up);
              
        });


        // let currentIndex = 0;
        // setInterval(() => {
        //     let children = this.root.children;
        //     let nextIndex = (currentIndex + 1) % children.length;

        //     let current = children[currentIndex];
        //     let next = children[nextIndex];

        //     next.style.transition = "none";
        //     next.style.transform = `translate(${100 - nextIndex * 100}%, 0px)`;

        //     setTimeout(() => {
        //         next.style.transition = "";
        //         current.style.transform = `translate(${-100 - currentIndex * 100}%, 0px)`;
        //         next.style.transform = `translate(${- nextIndex * 100}%, 0px)`;
        //         currentIndex = nextIndex;
        //     }, 16);
        // }, 3000);
        return this.root;
    }
    mountTo(parent) {
        parent.appendChild(this.render());
    }
}



let d = [
    "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
    "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
    "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
    "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg"
];

let a = <Carousel src={d}>
    </Carousel>;
a.mountTo(document.body);
