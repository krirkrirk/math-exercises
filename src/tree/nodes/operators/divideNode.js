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
exports.DivideNode = void 0;
var operatorNode_1 = require("./operatorNode");
var DivideNode = /** @class */ (function (_super) {
    __extends(DivideNode, _super);
    /**
     * @param leftChild num
     * @param rightChild denum
     */
    function DivideNode(leftChild, rightChild) {
        return _super.call(this, operatorNode_1.OperatorIds.divide, leftChild, rightChild, false, "\\div") || this;
    }
    DivideNode.prototype.toString = function () {
        return "(".concat(this.leftChild, ") \\div (").concat(this.rightChild, ")");
    };
    return DivideNode;
}(operatorNode_1.OperatorNode));
exports.DivideNode = DivideNode;
