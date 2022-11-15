"use strict";
exports.__esModule = true;
exports.EPSILON = void 0;
function getEpsilon() {
    var e = 1.0;
    while (1.0 + 0.5 * e !== 1.0)
        e *= 0.5;
    return e;
}
exports.EPSILON = getEpsilon();
