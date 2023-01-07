"use strict";
exports.__esModule = true;
exports.Rational = void 0;
var gcd_1 = require("../../mathutils/arithmetic/gcd");
var numberNode_1 = require("../../tree/nodes/numbers/numberNode");
var divideNode_1 = require("../../tree/nodes/operators/divideNode");
var integer_1 = require("../integer/integer");
var Rational = /** @class */ (function () {
    function Rational(numerator, denumerator) {
        this.num = numerator;
        this.denum = denumerator;
        this.value = numerator / denumerator;
        this.isSimplified = Math.abs((0, gcd_1.gcd)(numerator, denumerator)) === 1;
        this.tex = "\\frac{".concat(this.num, "}{").concat(this.denum, "}");
    }
    Rational.prototype.toTex = function () {
        return "\\frac{".concat(this.num, "}{").concat(this.denum, "}");
    };
    Rational.prototype.add = function (expression) {
        return this;
    };
    Rational.prototype.multiply = function (expression) {
        return this;
    };
    Rational.prototype.opposite = function () {
        return new Rational(-this.num, this.denum);
    };
    Rational.prototype.toTree = function () {
        return new divideNode_1.DivideNode(new numberNode_1.NumberNode(this.num), new numberNode_1.NumberNode(this.denum));
    };
    Rational.prototype.simplify = function () {
        var sign = (this.num > 0 && this.denum > 0) || (this.num < 0 && this.denum < 0)
            ? 1
            : -1;
        var div = Math.abs((0, gcd_1.gcd)(this.num, this.denum));
        if (Math.abs(this.denum) === div)
            return new integer_1.Integer(this.num / this.denum);
        return new Rational((sign * Math.abs(this.num)) / div, Math.abs(this.denum) / div);
    };
    return Rational;
}());
exports.Rational = Rational;
