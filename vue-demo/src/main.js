import HelloWorld from "./HelloWorld.vue";
import Vue from "Vue";

new Vue({
    el: "#app",
    render: h => h(HelloWorld)
})

for (const a of [1,2,3]) {
    console.log(a);
}