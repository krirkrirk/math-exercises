"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.Rational = exports.RationalConstructor = void 0;
var coprimesOf_1 = require("../../mathutils/arithmetic/coprimesOf");
var gcd_1 = require("../../mathutils/arithmetic/gcd");
var lcd_1 = require("../../mathutils/arithmetic/lcd");
var randint_1 = require("../../mathutils/random/randint");
var numberNode_1 = require("../../tree/nodes/numbers/numberNode");
var divideNode_1 = require("../../tree/nodes/operators/divideNode");
var random_1 = require("../../utils/random");
var shuffle_1 = require("../../utils/shuffle");
var integer_1 = require("../integer/integer");
var nombre_1 = require("../nombre");
var RationalConstructor = /** @class */ (function () {
    function RationalConstructor() {
    }
    /**
     * @param maxGcd max number by which the fraction is simplifiable
     */
    RationalConstructor.randomSimplifiable = function (maxGcd) {
        if (maxGcd === void 0) { maxGcd = 10; }
        var gcd = (0, randint_1.randint)(2, maxGcd);
        var max = (0, randint_1.randint)(3, 11);
        var min = (0, random_1.random)((0, coprimesOf_1.coprimesOf)(max));
        var _a = (0, shuffle_1.shuffle)([gcd * min, gcd * max]), num = _a[0], denum = _a[1];
        if (denum === gcd) {
            //si 10/2 on transforme en 2/10
            return new Rational(denum, num);
        }
        return new Rational(num, denum);
    };
    RationalConstructor.randomIrreductible = function (max) {
        if (max === void 0) { max = 11; }
        var a = (0, randint_1.randint)(2, max);
        var b = (0, random_1.random)(__spreadArray(__spreadArray([], (0, coprimesOf_1.coprimesOf)(a), true), [1], false));
        if (b === 1)
            return new Rational(b, a);
        var _a = (0, shuffle_1.shuffle)([a, b]), num = _a[0], denum = _a[1];
        return new Rational(num, denum);
    };
    return RationalConstructor;
}());
exports.RationalConstructor = RationalConstructor;
var Rational = /** @class */ (function () {
    function Rational(numerator, denumerator) {
        this.num = numerator;
        this.denum = denumerator;
        this.value = numerator / denumerator;
        this.isSimplified = Math.abs((0, gcd_1.gcd)(numerator, denumerator)) === 1;
        this.tex = "\\frac{".concat(this.num, "}{").concat(this.denum, "}");
        this.type = nombre_1.NumberType.Rational;
    }
    Rational.prototype.toTex = function () {
        return "\\frac{".concat(this.num, "}{").concat(this.denum, "}");
    };
    Rational.prototype.add = function (nb) {
        switch (nb.type) {
            case nombre_1.NumberType.Integer: {
                var num = this.num + this.denum * nb.value;
                return new Rational(num, this.denum).simplify();
            }
            case nombre_1.NumberType.Rational: {
                var rational = nb;
                var ppcm = (0, lcd_1.lcd)(rational.denum, this.denum);
                var num = this.num * (ppcm / this.denum) + rational.num * (ppcm / rational.denum);
                return new Rational(num, ppcm).simplify();
            }
        }
        throw Error("not implemented yet");
    };
    Rational.prototype.multiply = function (nb) {
        switch (nb.type) {
            case nombre_1.NumberType.Integer: {
                var num = this.num * nb.value;
                var denum = this.denum * nb.value;
                return new Rational(num, denum).simplify();
            }
            case nombre_1.NumberType.Rational: {
                var rational = nb;
                var num = this.num * rational.num;
                var denum = this.denum * rational.denum;
                return new Rational(num, denum).simplify();
            }
        }
        throw Error("not implemented yet");
    };
    Rational.prototype.opposite = function () {
        return new Rational(-this.num, this.denum);
    };
    Rational.prototype.toTree = function () {
        return new divideNode_1.DivideNode(new numberNode_1.NumberNode(this.num), new numberNode_1.NumberNode(this.denum));
    };
    Rational.prototype.simplify = function () {
        var sign = (this.num > 0 && this.denum > 0) || (this.num < 0 && this.denum < 0) ? 1 : -1;
        var div = Math.abs((0, gcd_1.gcd)(this.num, this.denum));
        if (Math.abs(this.denum) === div)
            return new integer_1.Integer(this.num / this.denum);
        return new Rational((sign * Math.abs(this.num)) / div, Math.abs(this.denum) / div);
    };
    return Rational;
}());
exports.Rational = Rational;
