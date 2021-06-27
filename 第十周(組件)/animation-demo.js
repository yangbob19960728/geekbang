import { Timeline, Animation } from "./animation.js";
import { ease, linear } from "./ease";

let t1 = new Timeline();

t1.start();

t1.add(new Animation( document.querySelector("#el").style, "transform", 0, 1000, 3000, 0, null, v => `translateX(${v}px)`));

document.querySelector("#pause-btn").addEventListener("click", () => t1.pause());
document.querySelector("#resume-btn").addEventListener("click", () => t1.resume());