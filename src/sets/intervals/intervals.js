"use strict";
exports.__esModule = true;
exports.Interval = void 0;
var epsilon_1 = require("../../numbers/epsilon");
var number_1 = require("../../numbers/number");
var round_1 = require("../../mathutils/round");
var mathSet_1 = require("../mathSet");
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
        this.type = isInt ? number_1.NumberType.Integer : number_1.NumberType.Real;
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
                console.log("".concat(left, "a;b").concat(right));
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
        return;
    };
    Interval.prototype.getRandomElement = function (precision) {
        if (precision === void 0) { precision = this.type === number_1.NumberType.Integer ? 0 : 2; }
        if (this.min === -Infinity || this.max === Infinity)
            throw Error("Can't chose amongst infinity");
        var min = this.boundType === BoundType.OO || this.boundType === BoundType.OF ? this.min + epsilon_1.EPSILON : this.min;
        var max = this.boundType === BoundType.OO || this.boundType === BoundType.FO ? this.max - epsilon_1.EPSILON : this.max;
        return (0, round_1.round)(min + Math.random() * (max - this.min), precision);
    };
    return Interval;
}());
exports.Interval = Interval;
