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
exports.FractionNode = void 0;
var operatorNode_1 = require("./operatorNode");
var FractionNode = /** @class */ (function (_super) {
    __extends(FractionNode, _super);
    /**
     * @param leftChild num
     * @param rightChild denum
     */
    function FractionNode(leftChild, rightChild) {
        return _super.call(this, operatorNode_1.OperatorIds.fraction, leftChild, rightChild, false, "\\frac") || this;
    }
    FractionNode.prototype.toString = function () {
        return "\\frac{".concat(this.leftChild, "}{").concat(this.rightChild, "}");
    };
    return FractionNode;
}(operatorNode_1.OperatorNode));
exports.FractionNode = FractionNode;
