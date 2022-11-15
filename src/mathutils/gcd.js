"use strict";
exports.__esModule = true;
exports.gcd = void 0;
function gcd(a, b) {
    return b ? gcd(b, a % b) : a;
}
exports.gcd = gcd;
