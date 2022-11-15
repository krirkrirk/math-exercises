"use strict";
exports.__esModule = true;
exports.DiscreteSet = void 0;
var randomIn_1 = require("../utils/randomIn");
var DiscreteSet = /** @class */ (function () {
    function DiscreteSet(elements) {
        var _this = this;
        this.elements = Array.from(new Set(elements));
        var tex = "{";
        this.elements.forEach(function (el, index) {
            tex += el;
            if (index < _this.elements.length - 1)
                tex += ";";
            else
                tex += "}";
        });
        this.tex = tex;
    }
    DiscreteSet.prototype.toTex = function () {
        return this.tex;
    };
    DiscreteSet.prototype.includes = function (el) {
        return this.elements.includes(el);
    };
    DiscreteSet.prototype.getRandomElement = function () {
        return (0, randomIn_1.randomIn)(this.elements);
    };
    return DiscreteSet;
}());
exports.DiscreteSet = DiscreteSet;
