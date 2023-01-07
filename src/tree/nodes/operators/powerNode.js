"use strict";
exports.__esModule = true;
exports.PowerNode = void 0;
var node_1 = require("../node");
var PowerNode = /** @class */ (function () {
    function PowerNode(leftChild, rightChild) {
        this.tex = "^";
        this.type = node_1.NodeType.operator;
        this.id = "power";
        this.leftChild = leftChild;
        this.rightChild = rightChild;
    }
    PowerNode.prototype.toString = function () {
        return "(".concat(this.leftChild, ")^{").concat(this.rightChild, "}");
    };
    return PowerNode;
}());
exports.PowerNode = PowerNode;
