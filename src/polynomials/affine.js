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
exports.Affine = exports.AffineConstructor = void 0;
var rational_1 = require("../numbers/rationals/rational");
var intervals_1 = require("../sets/intervals/intervals");
var polynomial_1 = require("./polynomial");
var discreteSet_1 = require("../sets/discreteSet");
var AffineConstructor = /** @class */ (function () {
    function AffineConstructor() {
    }
    AffineConstructor.random = function (domainA, domainB) {
        if (domainA === void 0) { domainA = new intervals_1.Interval("[[-10; 10]]").difference(new discreteSet_1.DiscreteSet([0])); }
        if (domainB === void 0) { domainB = new intervals_1.Interval("[[-10; 10]]"); }
        var a = domainA.getRandomElement();
        var b = domainB.getRandomElement();
        return new Affine(a, b);
    };
    AffineConstructor.differentRandoms = function (nb, domainA, domainB) {
        if (domainA === void 0) { domainA = new intervals_1.Interval("[[-10; 10]]").difference(new discreteSet_1.DiscreteSet([0])); }
        if (domainB === void 0) { domainB = new intervals_1.Interval("[[-10; 10]]"); }
        var res = [];
        var _loop_1 = function (i) {
            var aff;
            do {
                aff = AffineConstructor.random(domainA, domainB);
            } while (res.some(function (affine) { return affine.equals(aff); }));
            res.push(aff);
        };
        for (var i = 0; i < nb; i++) {
            _loop_1(i);
        }
        return res;
    };
    return AffineConstructor;
}());
exports.AffineConstructor = AffineConstructor;
var Affine = /** @class */ (function (_super) {
    __extends(Affine, _super);
    function Affine(a, b, variable) {
        if (variable === void 0) { variable = "x"; }
        var _this = _super.call(this, [b, a], variable) || this;
        _this.a = a;
        _this.b = b;
        _this.variable = variable;
        return _this;
    }
    Affine.prototype.getRoot = function () {
        return new rational_1.Rational(-this.b, this.a).simplify().toTex();
    };
    Affine.prototype.toString = function () {
        return _super.prototype.toTex.call(this);
    };
    return Affine;
}(polynomial_1.Polynomial));
exports.Affine = Affine;
