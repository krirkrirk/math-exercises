"use strict";
exports.__esModule = true;
exports.isSquare = void 0;
var isSquare = function (a) {
    return a > 0 && Math.sqrt(a) % 1 === 0;
};
exports.isSquare = isSquare;
