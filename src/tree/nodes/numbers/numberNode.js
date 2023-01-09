"use strict";
exports.__esModule = true;
exports.NumberNode = void 0;
var node_1 = require("../node");
var NumberNode = /** @class */ (function () {
    function NumberNode(value) {
        this.type = node_1.NodeType.number;
        this.value = value;
        this.tex = value + "";
    }
    NumberNode.prototype.toString = function () {
        return "".concat(this.tex);
    };
    return NumberNode;
}());
exports.NumberNode = NumberNode;
