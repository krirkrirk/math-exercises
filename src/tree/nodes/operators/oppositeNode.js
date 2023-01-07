"use strict";
exports.__esModule = true;
exports.OppositeNode = void 0;
var node_1 = require("../node");
var OppositeNode = /** @class */ (function () {
    function OppositeNode(leftChild) {
        this.type = node_1.NodeType.operator;
        this.id = "opposite";
        this.tex = "-";
        this.leftChild = leftChild;
        this.rightChild = null;
    }
    OppositeNode.prototype.toString = function () {
        return "-(".concat(this.leftChild, ")");
    };
    return OppositeNode;
}());
exports.OppositeNode = OppositeNode;
