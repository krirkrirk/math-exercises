"use strict";
exports.__esModule = true;
exports.SubstractNode = void 0;
var node_1 = require("../node");
var SubstractNode = /** @class */ (function () {
    function SubstractNode(leftChild, rightChild) {
        this.type = node_1.NodeType.operator;
        this.id = "substract";
        this.tex = "-";
        this.leftChild = leftChild;
        this.rightChild = rightChild;
    }
    SubstractNode.prototype.toString = function () {
        return "".concat(this.leftChild, "-(").concat(this.rightChild, ")");
    };
    return SubstractNode;
}());
exports.SubstractNode = SubstractNode;
