"use strict";
exports.__esModule = true;
exports.lcd = void 0;
function lcd(a, b) {
    var max = Math.max(a, b);
    for (var i = max; i < a * b; i++) {
        if (i % a === 0 && i % b === 0)
            return i;
    }
    return a * b;
}
exports.lcd = lcd;
