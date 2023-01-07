"use strict";
exports.__esModule = true;
exports.multiply = void 0;
exports.multiply = {
    tex: "\\times",
    mathApply: function (a, b) {
        return a.multiply(b);
    },
    texApply: function (a, b) {
        var _a, _b;
        var aTex = ((_a = a.toTex) === null || _a === void 0 ? void 0 : _a.call(a)) || a + "";
        var bTex = ((_b = b.toTex) === null || _b === void 0 ? void 0 : _b.call(b)) || b + "";
        var shouldAddBracketsToA = aTex.includes("-") || aTex.includes("+");
        var shouldAddBracketsToB = bTex.includes("-") || bTex.includes("+");
        if (shouldAddBracketsToB && shouldAddBracketsToA) {
            return "(".concat(aTex, ") (").concat(bTex, ")");
        }
        else if (shouldAddBracketsToB) {
            return "".concat(aTex, " (").concat(bTex, ")");
        }
        else if (shouldAddBracketsToA) {
            return "(".concat(aTex, ") \\times ").concat(bTex);
        }
        else {
            return "".concat(aTex, " \\times ").concat(bTex);
        }
    }
};
