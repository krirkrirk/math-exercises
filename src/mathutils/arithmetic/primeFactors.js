"use strict";
exports.__esModule = true;
exports.primeFactors = void 0;
/***
 * returns array of prime factors
 * e.g 12 -> [2, 2, 3]
 */
var primeFactors = function (a) {
    var factors = [];
    var divisor = 2;
    while (a >= 2) {
        if (a % divisor === 0) {
            factors.push(divisor);
            a = a / divisor;
        }
        else {
            divisor++;
        }
    }
    return factors;
};
exports.primeFactors = primeFactors;
