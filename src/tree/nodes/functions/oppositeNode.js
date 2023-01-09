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
exports.OppositeNode = void 0;
var functionNode_1 = require("./functionNode");
var OppositeNode = /** @class */ (function (_super) {
    __extends(OppositeNode, _super);
    function OppositeNode(child) {
        return _super.call(this, functionNode_1.FunctionsIds.opposite, child, "-") || this;
    }
    OppositeNode.prototype.toString = function () {
        return "-(".concat(this.child, ")");
    };
    return OppositeNode;
}(functionNode_1.FunctionNode));
exports.OppositeNode = OppositeNode;
