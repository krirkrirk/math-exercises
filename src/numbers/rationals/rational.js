"use strict";
exports.__esModule = true;
exports.Rational = void 0;
var gcd_1 = require("../../mathutils/arithmetic/gcd");
var Rational = /** @class */ (function () {
    function Rational(numerator, denumerator) {
        this.num = numerator;
        this.denum = denumerator;
        this.isSimplified = Math.abs((0, gcd_1.gcd)(numerator, denumerator)) === 1;
    }
    Rational.prototype.toTex = function () {
        return "\\frac{".concat(this.num, "}{").concat(this.denum, "}");
    };
    Rational.prototype.simplify = function () {
        var div = Math.abs((0, gcd_1.gcd)(this.num, this.denum));
        return new Rational(this.num / div, this.denum / div);
    };
    return Rational;
}());
exports.Rational = Rational;
