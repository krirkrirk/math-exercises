"use strict";
exports.__esModule = true;
exports.Polynomial = void 0;
var numberNode_1 = require("../tree/nodes/numbers/numberNode");
var addNode_1 = require("../tree/nodes/operators/addNode");
var multiplyNode_1 = require("../tree/nodes/operators/multiplyNode");
var oppositeNode_1 = require("../tree/nodes/operators/oppositeNode");
var powerNode_1 = require("../tree/nodes/operators/powerNode");
var variableNode_1 = require("../tree/nodes/variables/variableNode");
var Polynomial = /** @class */ (function () {
    /**
     *
     * @param coefficients coefficients[i] est le coeff de x^i
     * @param variable
     */
    function Polynomial(coefficients, variable) {
        if (variable === void 0) { variable = "x"; }
        if (coefficients.length === 0)
            throw Error("coeffs must be not null");
        if (coefficients[coefficients.length - 1] === 0) {
            throw Error("n-th coeff must be not null");
        }
        this.coefficients = coefficients;
        this.variable = variable;
        this.degree = coefficients.length - 1;
    }
    Polynomial.prototype.equals = function (P) {
        return (P.degree === this.degree &&
            this.coefficients.every(function (coeff, i) { return coeff === P.coefficients[i]; }));
    };
    Polynomial.prototype.getRoots = function () { };
    Polynomial.prototype.add = function (P) {
        if (P.variable !== this.variable)
            throw Error("Can't add two polynomials with different variables");
        var newDegree = P.degree === this.degree &&
            P.coefficients[P.degree] === -this.coefficients[this.degree]
            ? P.degree - 1
            : Math.max(P.degree, this.degree);
        var res = [];
        for (var i = 0; i < newDegree + 1; i++) {
            res[i] = P.coefficients[i] + this.coefficients[i];
        }
        return new Polynomial(res, this.variable);
    };
    Polynomial.prototype.times = function (nb) {
        return new Polynomial(this.coefficients.map(function (coeff) { return coeff * nb; }), this.variable);
    };
    Polynomial.prototype.multiply = function (Q) {
        if (Q.variable !== this.variable)
            throw Error("Can't multiply two polynomials with different variables");
        var p = this.degree;
        var q = Q.degree;
        var res = Array.apply(0, new Array(this.degree)).map(function (i) { return 0; });
        for (var k = 0; k <= p + q; k++) {
            var sum = 0;
            for (var m = 0; m <= k; m++) {
                sum += (this.coefficients[m] || 0) * (Q.coefficients[k - m] || 0);
            }
            res[k] = sum;
        }
        return new Polynomial(res, this.variable);
    };
    Polynomial.prototype.opposite = function () {
        return new Polynomial(this.coefficients.map(function (coeff) { return -coeff; }), this.variable);
    };
    Polynomial.prototype.toTree = function () {
        var _this = this;
        var recursive = function (cursor) {
            var coeff = _this.coefficients[cursor];
            if (coeff === 0)
                return recursive(cursor - 1);
            if (cursor === 0) {
                return new numberNode_1.NumberNode(coeff);
            }
            var monome = cursor > 1
                ? new powerNode_1.PowerNode(new variableNode_1.VariableNode(_this.variable), new numberNode_1.NumberNode(cursor))
                : new variableNode_1.VariableNode(_this.variable);
            var res;
            if (coeff === 1)
                res = monome;
            else if (coeff === -1)
                res = new oppositeNode_1.OppositeNode(monome);
            else
                res = new multiplyNode_1.MultiplyNode(new numberNode_1.NumberNode(coeff), monome);
            var nextCoeff;
            for (var i = cursor - 1; i > -1; i--) {
                if (_this.coefficients[i]) {
                    nextCoeff = _this.coefficients[i];
                    break;
                }
            }
            if (nextCoeff) {
                return new addNode_1.AddNode(res, recursive(cursor - 1));
            }
            else {
                return res;
            }
        };
        return recursive(this.degree);
    };
    Polynomial.prototype.toTex = function () {
        var s = "";
        for (var i = this.degree; i > -1; i--) {
            var coeff = this.coefficients[i];
            if (coeff === 0)
                continue;
            if (i === 0)
                s += coeff > 0 ? "+".concat(coeff) : coeff;
            else if (i === this.degree) {
                s += coeff === 1 ? "" : coeff === -1 ? "-" : coeff;
            }
            else {
                s +=
                    coeff === 1
                        ? "+"
                        : coeff === -1
                            ? "-"
                            : coeff > 0
                                ? "+".concat(coeff)
                                : coeff;
            }
            //x^n
            if (i === 0)
                continue;
            if (i === 1)
                s += this.variable;
            else
                s += "".concat(this.variable, "^{").concat(i, "}");
        }
        return s;
    };
    Polynomial.prototype.toString = function () {
        return this.toTex();
    };
    return Polynomial;
}());
exports.Polynomial = Polynomial;
