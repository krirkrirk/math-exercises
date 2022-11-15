"use strict";
exports.__esModule = true;
exports.round = void 0;
var epsilon_1 = require("../numbers/epsilon");
function round(x, precision) {
    return Math.round((x + epsilon_1.EPSILON) * Math.pow(10, precision)) / Math.pow(10, precision);
}
exports.round = round;
