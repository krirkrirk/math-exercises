"use strict";
exports.__esModule = true;
exports.substract = void 0;
exports.substract = {
    tex: "-",
    apply: function (a, b) {
        return a.add(b.opposite());
    }
};
