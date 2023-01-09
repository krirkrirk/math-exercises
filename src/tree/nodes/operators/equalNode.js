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
exports.EqualNode = void 0;
var operatorNode_1 = require("./operatorNode");
var EqualNode = /** @class */ (function (_super) {
    __extends(EqualNode, _super);
    function EqualNode(leftChild, rightChild) {
        return _super.call(this, operatorNode_1.OperatorIds.equal, leftChild, rightChild, true, "=") || this;
    }
    EqualNode.prototype.toString = function () {
        return "".concat(this.leftChild, " = ").concat(this.rightChild);
    };
    return EqualNode;
}(operatorNode_1.OperatorNode));
exports.EqualNode = EqualNode;
