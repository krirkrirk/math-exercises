"use strict";
exports.__esModule = true;
exports.coprimesOf = void 0;
var gcd_1 = require("./gcd");
var coprimesOf = function (nb) {
    var coprimes = [];
    for (var i = 2; i <= nb; i++) {
        if ((0, gcd_1.gcd)(nb, i) === 1)
            coprimes.push(i);
    }
    return coprimes;
};
exports.coprimesOf = coprimesOf;
