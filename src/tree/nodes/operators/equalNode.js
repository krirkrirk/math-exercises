"use strict";
exports.__esModule = true;
exports.EqualNode = void 0;
var node_1 = require("../node");
var EqualNode = /** @class */ (function () {
    function EqualNode(leftChild, rightChild) {
        this.type = node_1.NodeType.operator;
        this.id = "equal";
        this.tex = "=";
        this.leftChild = leftChild;
        this.rightChild = rightChild;
    }
    EqualNode.prototype.toString = function () {
        return "".concat(this.leftChild, " = ").concat(this.rightChild);
    };
    return EqualNode;
}());
exports.EqualNode = EqualNode;
