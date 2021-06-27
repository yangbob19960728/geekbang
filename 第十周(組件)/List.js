import { Conponment, STATE, ATTRIBUTE, creatElement } from "./framework.js";
import { enableGesture } from "./gesture/gesture";

export { STATE, ATTRIBUTE } from './framework.js'

export class List extends Conponment {
    constructor() {
        super()
    }
    render() {
        this.children = this[ATTRIBUTE].data.map(this.tamplate)
        this.root = (<div>{this.children}</div>).render()
        return this.root
    }
    appendChild(child) {
        this.tamplate = child
        this.render()
    }
}