"use strict";
exports.__esModule = true;
exports.SqrtNode = void 0;
var node_1 = require("../node");
var SqrtNode = /** @class */ (function () {
    function SqrtNode(leftChild) {
        this.type = node_1.NodeType["function"];
        this.id = "sqrt";
        this.tex = "\\sqrt";
        this.leftChild = leftChild;
        this.rightChild = null;
    }
    SqrtNode.prototype.toString = function () {
        return "sqrt(".concat(this.leftChild, ")");
    };
    return SqrtNode;
}());
exports.SqrtNode = SqrtNode;
