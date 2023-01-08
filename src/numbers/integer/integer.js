"use strict";
exports.__esModule = true;
exports.Integer = void 0;
var numberNode_1 = require("../../tree/nodes/numbers/numberNode");
var nombre_1 = require("../nombre");
var Integer = /** @class */ (function () {
    function Integer(value) {
        this.value = value;
        this.tex = value + "";
        this.type = nombre_1.NumberType.Integer;
    }
    Integer.prototype.toTree = function () {
        return new numberNode_1.NumberNode(this.value);
    };
    return Integer;
}());
exports.Integer = Integer;
