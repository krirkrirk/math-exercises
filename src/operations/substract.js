"use strict";
exports.__esModule = true;
exports.substract = void 0;
exports.substract = {
    tex: "-",
    mathApply: function (a, b) {
        return a.add(b.opposite());
    },
    texApply: function (a, b) {
        var _a, _b;
        var aTex = ((_a = a.toTex) === null || _a === void 0 ? void 0 : _a.call(a)) || a + "";
        var bTex = ((_b = b.toTex) === null || _b === void 0 ? void 0 : _b.call(b)) || b + "";
        var shouldAddBrackets = bTex[0] !== "(" && (bTex.includes("-") || bTex.includes("-"));
        if (shouldAddBrackets) {
            return "".concat(aTex, " - ").concat(bTex);
        }
        else {
            return "".concat(aTex, " - ").concat(bTex);
        }
    }
};
