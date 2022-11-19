"use strict";
exports.__esModule = true;
exports.randint = void 0;
var randint = function (a, b) {
    if (b === undefined)
        return Math.floor(Math.random() * a);
    return a + Math.floor(Math.random() * (b - a));
};
exports.randint = randint;
