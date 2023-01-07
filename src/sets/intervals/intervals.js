"use strict";
exports.__esModule = true;
exports.Interval = void 0;
var epsilon_1 = require("../../numbers/epsilon");
var nombre_1 = require("../../numbers/nombre");
var round_1 = require("../../mathutils/round");
var mathSet_1 = require("../mathSet");
var integer_1 = require("../../numbers/integer/integer");
var real_1 = require("../../numbers/reals/real");
var BoundType;
(function (BoundType) {
    BoundType["OO"] = "]a;b[";
    BoundType["OF"] = "]a;b]";
    BoundType["FO"] = "[a;b[";
    BoundType["FF"] = "[a;b]";
})(BoundType || (BoundType = {}));
var Interval = /** @class */ (function () {
    /**
     * [[a; b]] pour un interval d'integer;  [a;b] pour des réels
     */
    function Interval(tex) {
        if (tex === void 0) { tex = "[-10; 10]"; }
        this.tex = tex;
        var isInt = tex[1] === "[" || tex[1] === "]";
        this.type = isInt ? nombre_1.NumberType.Integer : nombre_1.NumberType.Real;
        var left = tex[0];
        var right = tex[tex.length - 1];
        var _a = tex.slice(isInt ? 2 : 1, isInt ? tex.length - 2 : tex.length - 1).split(";"), a = _a[0], b = _a[1];
        switch ("".concat(left, "a;b").concat(right)) {
            case "[a;b]":
                this.boundType = BoundType.FF;
                break;
            case "]a;b[":
                this.boundType = BoundType.OO;
                break;
            case "[a;b[":
                this.boundType = BoundType.FO;
                break;
            case "]a;b]":
                this.boundType = BoundType.OF;
                break;
            default:
                throw console.error("wrong interval");
        }
        function getBound(bound) {
            return bound === "-\\infty"
                ? Number.NEGATIVE_INFINITY
                : bound === "+\\infty"
                    ? Number.POSITIVE_INFINITY
                    : Number(bound);
        }
        this.min = getBound(a);
        this.max = getBound(b);
    }
    // union(interval: Interval): MathSet {
    //[a,b] [c,d]
    //si a=c return a, max(b,d)
    //si si b = d return min(a,c), b
    //si a=d return c,b sauf si  OXXO
    //si b=c return a,d sauf si XOOX
    //si c > b ou d < a alors union disjointe avec plus petit en 1er
    //sinon return min(a,c), max(b,d)
    //res = a
    // return new MathSet();
    // }
    Interval.prototype.exclude = function (nb) {
        var _this = this;
        var rand = function () {
            var x;
            do {
                x = _this.getRandomElement();
            } while (x.value === nb);
            return x;
        };
        return new mathSet_1.MathSet(this.toTex() + "\\{".concat(nb, "\\}"), rand);
    };
    Interval.prototype.difference = function (set) {
        var _this = this;
        var rand = function () {
            var x;
            do {
                x = _this.getRandomElement();
            } while (set.includes(x));
            return x;
        };
        return new mathSet_1.MathSet(this.toTex() + "\\ ".concat(set.toTex()), rand);
    };
    Interval.prototype.toTex = function () {
        return this.tex;
    };
    Interval.prototype.getRandomElement = function (precision) {
        if (precision === void 0) { precision = this.type === nombre_1.NumberType.Integer ? 0 : 2; }
        if (this.min === -Infinity || this.max === Infinity)
            throw Error("Can't chose amongst infinity");
        var min = this.boundType === BoundType.OO || this.boundType === BoundType.OF ? this.min + epsilon_1.EPSILON : this.min;
        var max = this.boundType === BoundType.OO || this.boundType === BoundType.FO ? this.max - epsilon_1.EPSILON : this.max;
        var value = (0, round_1.round)(min + Math.random() * (max - this.min), precision);
        switch (this.type) {
            case nombre_1.NumberType.Integer:
                return new integer_1.Integer(value, value.toString());
            default:
                return new real_1.Real(value, value.toString());
        }
    };
    return Interval;
}());
exports.Interval = Interval;
