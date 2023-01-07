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
exports.SquareRoot = exports.SquareRootConstructor = void 0;
var isSquare_1 = require("../../mathutils/arithmetic/isSquare");
var primeFactors_1 = require("../../mathutils/arithmetic/primeFactors");
var randint_1 = require("../../mathutils/random/randint");
var numberNode_1 = require("../../tree/nodes/numbers/numberNode");
var multiplyNode_1 = require("../../tree/nodes/operators/multiplyNode");
var real_1 = require("./real");
var sqrtNode_1 = require("../../tree/nodes/functions/sqrtNode");
var SquareRootConstructor = /** @class */ (function () {
    function SquareRootConstructor() {
    }
    /**
     * @returns simplifiable square root type sqrt(c)=a*sqrt(b)
     */
    SquareRootConstructor.randomSimplifiable = function (_a) {
        var _b = _a.allowPerfectSquare, allowPerfectSquare = _b === void 0 ? false : _b, _c = _a.maxSquare, maxSquare = _c === void 0 ? 11 : _c;
        var a = (0, randint_1.randint)(2, maxSquare);
        var b;
        var bMin = allowPerfectSquare ? 1 : 2;
        do {
            b = (0, randint_1.randint)(bMin, maxSquare);
        } while (b % (a * a) === 0 || (0, isSquare_1.isSquare)(b));
        return new SquareRoot(a * a * b);
    };
    return SquareRootConstructor;
}());
exports.SquareRootConstructor = SquareRootConstructor;
var SquareRoot = /** @class */ (function (_super) {
    __extends(SquareRoot, _super);
    function SquareRoot(operand) {
        var _this = _super.call(this, Math.sqrt(operand), "\\sqrt{".concat(operand, "}")) || this;
        _this.operand = operand;
        return _this;
    }
    SquareRoot.prototype.simplify = function () {
        var factors = (0, primeFactors_1.primeFactors)(this.operand);
        // finds primes with even exponents
        var multiples = [1];
        for (var i = 0; i < factors.length - 1; i++) {
            if (factors[i] === factors[i + 1]) {
                multiples.push(factors[i]);
                factors.splice(i, 2);
                i--;
            }
        }
        var outsideSqrt = multiples.reduce(function (x, y) { return x * y; });
        var insideSqrt = factors.length === 0 ? 1 : factors.reduce(function (x, y) { return x * y; });
        var simplified = insideSqrt !== 1
            ? new real_1.Real(outsideSqrt * Math.sqrt(insideSqrt), "".concat(outsideSqrt === 1 ? "" : "".concat(outsideSqrt), "\\sqrt{").concat(insideSqrt, "}"))
            : new real_1.Real(outsideSqrt, outsideSqrt + "");
        simplified.toTree = function () {
            return insideSqrt !== 1
                ? outsideSqrt === 1
                    ? new sqrtNode_1.SqrtNode(new numberNode_1.NumberNode(insideSqrt))
                    : new multiplyNode_1.MultiplyNode(new numberNode_1.NumberNode(outsideSqrt), new sqrtNode_1.SqrtNode(new numberNode_1.NumberNode(insideSqrt)))
                : new numberNode_1.NumberNode(outsideSqrt);
        };
        return simplified;
    };
    SquareRoot.prototype.toTex = function () {
        return this.tex;
    };
    SquareRoot.prototype.toTree = function () {
        return new sqrtNode_1.SqrtNode(new numberNode_1.NumberNode(this.operand));
    };
    return SquareRoot;
}(real_1.Real));
exports.SquareRoot = SquareRoot;
