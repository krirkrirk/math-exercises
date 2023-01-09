"use strict";
exports.__esModule = true;
exports.OperatorNode = exports.OperatorIds = void 0;
var coin_1 = require("../../../utils/coin");
var node_1 = require("../node");
var OperatorIds;
(function (OperatorIds) {
    OperatorIds[OperatorIds["add"] = 0] = "add";
    OperatorIds[OperatorIds["substract"] = 1] = "substract";
    OperatorIds[OperatorIds["multiply"] = 2] = "multiply";
    OperatorIds[OperatorIds["fraction"] = 3] = "fraction";
    OperatorIds[OperatorIds["divide"] = 4] = "divide";
    OperatorIds[OperatorIds["power"] = 5] = "power";
    OperatorIds[OperatorIds["equal"] = 6] = "equal";
})(OperatorIds = exports.OperatorIds || (exports.OperatorIds = {}));
var OperatorNode = /** @class */ (function () {
    function OperatorNode(id, leftChild, rightChild, isCommutative, tex) {
        this.type = node_1.NodeType.operator;
        this.id = id;
        this.leftChild = leftChild;
        this.rightChild = rightChild;
        this.isCommutative = isCommutative;
        this.tex = tex;
    }
    /**shuffles in place */
    OperatorNode.prototype.shuffle = function () {
        var _a;
        if (!this.isCommutative)
            return this;
        if ((0, coin_1.coin)())
            return this;
        _a = [this.rightChild, this.leftChild], this.leftChild = _a[0], this.rightChild = _a[1];
        return this;
    };
    return OperatorNode;
}());
exports.OperatorNode = OperatorNode;
