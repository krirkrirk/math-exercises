"use strict";
exports.__esModule = true;
exports.Latex = exports.LatexConstructor = void 0;
var LatexConstructor = /** @class */ (function () {
    function LatexConstructor() {
    }
    LatexConstructor.fromString = function (s) {
        return new Latex(s);
    };
    LatexConstructor.monome = function (n, l) {
        return;
    };
    return LatexConstructor;
}());
exports.LatexConstructor = LatexConstructor;
var Latex = /** @class */ (function () {
    function Latex(tex) {
        this.tex = tex;
    }
    Latex.prototype.toTex = function () {
        return this.tex;
    };
    Latex.prototype.add = function (term) {
        var s = this.tex;
        switch (typeof term) {
            case "number":
                this.tex += term === 0 ? "" : "".concat(term > 0 && this.tex !== "" ? "+" : "").concat(term);
                break;
            default:
                break;
        }
        return this.tex;
        // return new Latex(s);
    };
    return Latex;
}());
exports.Latex = Latex;
