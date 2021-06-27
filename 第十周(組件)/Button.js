import { Conponment, STATE, ATTRIBUTE, creatElement } from "./framework.js";
import { enableGesture } from "./gesture/gesture";

export { STATE, ATTRIBUTE } from './framework.js'

export class Button extends Conponment {
    constructor() {
        super()
    }
    render() {
        this.childContainer = <span />
        this.root = (<div>{this.childContainer}</div>).render()
        return this.root
    }
    appendChild(child) {
        if (!this.childContainer) {
            this.render()
        }
        this.childContainer.appendChild(child)
    }
}