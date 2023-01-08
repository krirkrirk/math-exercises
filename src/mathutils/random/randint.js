"use strict";
exports.__esModule = true;
exports.randint = void 0;
/**
 * @returns random [[a, b[[
 */
var randint = function (a, b, excludes) {
    if (b === undefined)
        return Math.floor(Math.random() * a);
    if (!excludes)
        return a + Math.floor(Math.random() * (b - a));
    var res;
    do {
        res = a + Math.floor(Math.random() * (b - a));
    } while (excludes.includes(res));
    return res;
};
exports.randint = randint;
