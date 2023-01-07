"use strict";
exports.__esModule = true;
exports.NumberNode = void 0;
var node_1 = require("../node");
var NumberNode = /** @class */ (function () {
    function NumberNode(tex, value) {
        this.id = "number";
        this.leftChild = null;
        this.rightChild = null;
        if (isNaN(+tex))
            throw Error("not a number");
        this.value = value;
        this.tex = tex;
        this.type = node_1.NodeType.number;
    }
    return NumberNode;
}());
exports.NumberNode = NumberNode;
