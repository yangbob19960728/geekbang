"use strict";

var _HelloWorld = _interopRequireDefault(require("./HelloWorld.vue"));

var _Vue = _interopRequireDefault(require("Vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

new _Vue["default"]({
  el: "#app",
  render: function render(h) {
    return h(_HelloWorld["default"]);
  }
});

for (var _i = 0, _arr = [1, 2, 3]; _i < _arr.length; _i++) {
  var a = _arr[_i];
  console.log(a);
}

