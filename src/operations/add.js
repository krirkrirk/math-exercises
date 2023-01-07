"use strict";
exports.__esModule = true;
exports.add = void 0;
exports.add = {
    tex: "+",
    mathApply: function (a, b) {
        return a.add(b);
    },
    texApply: function (a, b) {
        var _a, _b;
        var aTex = ((_a = a.toTex) === null || _a === void 0 ? void 0 : _a.call(a)) || a + "";
        var bTex = ((_b = b.toTex) === null || _b === void 0 ? void 0 : _b.call(b)) || b + "";
        if (bTex[0] === "-")
            return "".concat(aTex, " + ").concat(bTex);
        return "".concat(aTex, " + ").concat(bTex);
    }
};
