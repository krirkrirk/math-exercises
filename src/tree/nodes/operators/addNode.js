"use strict";
exports.__esModule = true;
exports.AddNode = void 0;
var node_1 = require("../node");
var AddNode = /** @class */ (function () {
    function AddNode(leftChild, rightChild) {
        this.type = node_1.NodeType.operator;
        this.id = "add";
        this.tex = "+";
        this.leftChild = leftChild;
        this.rightChild = rightChild;
    }
    AddNode.prototype.toString = function () {
        return "".concat(this.leftChild, " + ").concat(this.rightChild);
    };
    return AddNode;
}());
exports.AddNode = AddNode;
