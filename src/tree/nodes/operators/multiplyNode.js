"use strict";
exports.__esModule = true;
exports.MultiplyNode = void 0;
var node_1 = require("../node");
var MultiplyNode = /** @class */ (function () {
    function MultiplyNode(leftChild, rightChild) {
        this.type = node_1.NodeType.operator;
        this.id = "multiply";
        this.tex = "\\times";
        this.leftChild = leftChild;
        this.rightChild = rightChild;
    }
    return MultiplyNode;
}());
exports.MultiplyNode = MultiplyNode;
