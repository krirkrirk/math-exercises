"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.AddNode = void 0;
var operatorNode_1 = require("./operatorNode");
var AddNode = /** @class */ (function (_super) {
    __extends(AddNode, _super);
    function AddNode(leftChild, rightChild) {
        var _this = _super.call(this, operatorNode_1.OperatorIds.add, leftChild, rightChild, true, "+") || this;
        _this.leftChild = leftChild;
        _this.rightChild = rightChild;
        return _this;
    }
    AddNode.prototype.toString = function () {
        return "".concat(this.leftChild, " + ").concat(this.rightChild);
    };
    return AddNode;
}(operatorNode_1.OperatorNode));
exports.AddNode = AddNode;
