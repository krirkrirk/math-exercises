"use strict";
exports.__esModule = true;
exports.Real = void 0;
var numberNode_1 = require("../../tree/nodes/numbers/numberNode");
var nombre_1 = require("../nombre");
var Real = /** @class */ (function () {
    function Real(value, tex) {
        this.value = value;
        this.tex = tex;
        this.type = nombre_1.NumberType.Real;
    }
    Real.prototype.toTree = function () {
        return new numberNode_1.NumberNode(this.value);
    };
    return Real;
}());
exports.Real = Real;
