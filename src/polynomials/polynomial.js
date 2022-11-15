"use strict";
exports.__esModule = true;
exports.Polynomial = void 0;
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
        if (coefficients[coefficients.length - 1] === 0)
            throw Error("n-th coeff must be not null");
        this.coefficients = coefficients;
        this.variable = variable;
        this.degree = coefficients.length - 1;
    }
    Polynomial.prototype.equals = function (P) {
        return P.degree === this.degree && this.coefficients.every(function (coeff, i) { return coeff === P.coefficients[i]; });
    };
    Polynomial.prototype.add = function (P) {
        if (P.variable !== this.variable)
            throw Error("Can't add two polynomials with different variables");
        var newDegree = P.degree === this.degree && P.coefficients[P.degree] === -this.coefficients[this.degree]
            ? P.degree - 1
            : Math.max(P.degree, this.degree);
        var res = [];
        for (var i = 0; i < newDegree + 1; i++) {
            res[i] = P.coefficients[i] + this.coefficients[i];
        }
        return new Polynomial(res, this.variable);
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
    Polynomial.prototype.toTex = function () {
        // if (this.degree == 0) return "" + this.b;
        // function getMonome(power: number): string {
        //   if (power === 0) return "";
        //   if (power === 1) return this.variable;
        //   else return `${this.variable}^{${power}}`;
        // }
        // let s = this.coefficients[this.degree] + this.variable + this.degree > 1 ? `^{${this.degree}}` : "";
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
                s += coeff === 1 ? "+" : coeff === -1 ? "-" : coeff > 0 ? "+".concat(coeff) : coeff;
            }
            //x^n
            if (i === 0)
                continue;
            if (i === 1)
                s += this.variable;
            else
                s += "".concat(this.variable, "^{").concat(i, "}");
            // latex.add(this.coefficients[i]);
            // s += addLatex(this.coefficients[i]);
            // s += this.coefficients[i] + this.variable + `^{${i}}`;
        }
        return s;
    };
    return Polynomial;
}());
exports.Polynomial = Polynomial;
