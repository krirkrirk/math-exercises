"use strict";
exports.__esModule = true;
exports.Integer = void 0;
var numberNode_1 = require("../../tree/nodes/numbers/numberNode");
var nombre_1 = require("../nombre");
var rational_1 = require("../rationals/rational");
var Integer = /** @class */ (function () {
    function Integer(value) {
        this.value = value;
        this.tex = value + "";
        this.type = nombre_1.NumberType.Integer;
    }
    Integer.prototype.toTree = function () {
        return new numberNode_1.NumberNode(this.value);
    };
    Integer.prototype.divide = function (nb) {
        switch (nb.type) {
            case nombre_1.NumberType.Integer:
                return new rational_1.Rational(this.value, nb.value).simplify();
            case nombre_1.NumberType.Rational:
                var rational = nb;
                return new rational_1.Rational(this.value * rational.denum, rational.num).simplify();
            default:
                throw Error("not implemented");
        }
    };
    return Integer;
}());
exports.Integer = Integer;
