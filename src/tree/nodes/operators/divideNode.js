"use strict";
exports.__esModule = true;
exports.DivideNode = void 0;
var node_1 = require("../node");
var DivideNode = /** @class */ (function () {
    /**
     * @param leftChild num
     * @param rightChild denum
     */
    function DivideNode(leftChild, rightChild) {
        this.type = node_1.NodeType.operator;
        this.id = "divide";
        this.tex = "\\frac";
        this.leftChild = leftChild;
        this.rightChild = rightChild;
    }
    DivideNode.prototype.toString = function () {
        return "\\frac{".concat(this.leftChild, "}{").concat(this.rightChild, "}");
    };
    return DivideNode;
}());
exports.DivideNode = DivideNode;
