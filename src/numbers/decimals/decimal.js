"use strict";
exports.__esModule = true;
exports.Decimal = exports.DecimalConstructor = void 0;
var randint_1 = require("../../mathutils/random/randint");
var numberNode_1 = require("../../tree/nodes/numbers/numberNode");
var integer_1 = require("../integer/integer");
var nombre_1 = require("../nombre");
var DecimalConstructor = /** @class */ (function () {
    function DecimalConstructor() {
    }
    DecimalConstructor.randomFracPart = function (precision) {
        var decimals = "";
        for (var i = 0; i < precision; i++) {
            decimals += (0, randint_1.randint)(i === precision - 1 ? 1 : 0, 10);
        }
        return decimals;
    };
    DecimalConstructor.random = function (min, max, precision) {
        var int = (0, randint_1.randint)(min, max) + "";
        var decimals = DecimalConstructor.randomFracPart(precision);
        return DecimalConstructor.fromParts(int, decimals);
    };
    DecimalConstructor.fromParts = function (intPart, decimalPart) {
        return new Decimal(Number("" + intPart + "." + decimalPart));
    };
    return DecimalConstructor;
}());
exports.DecimalConstructor = DecimalConstructor;
var Decimal = /** @class */ (function () {
    function Decimal(value) {
        this.type = nombre_1.NumberType.Decimal;
        this.value = value;
        this.tex = value + "";
        var _a = (value + "").split("."), intPartString = _a[0], decimalPartString = _a[1];
        this.intPart = Number(intPartString);
        this.decimalPart = decimalPartString || "";
        this.precision = this.decimalPart.length;
    }
    /**
     *
     * @param precision 0 = unité, 1 = dizieme, ... , -1 : dizaine
     * @returns
     */
    Decimal.prototype.round = function (precision) {
        var intPartString = this.intPart + "";
        if (precision < 0) {
            if (precision < -intPartString.length)
                throw Error("can't round to higher precision");
            return new integer_1.Integer(this.intPart).round(-precision);
        }
        if (precision > this.precision)
            throw Error("can't round to higher precision");
        if (precision === this.precision)
            return this;
        var newFracPart = "", newIntPart = "";
        var shouldRoundUp = Number(this.decimalPart[precision]) > 4;
        if (shouldRoundUp) {
            var retenue = true;
            var i = precision - 1;
            while (retenue) {
                if (i > -1) {
                    var nb = (Number(this.decimalPart[i]) + 1) % 10;
                    if (nb || newFracPart) {
                        newFracPart = nb.toString() + newFracPart;
                    }
                    if (nb !== 0) {
                        retenue = false;
                        for (var j = i - 1; j > -1; j--) {
                            newFracPart = this.decimalPart[j] + newFracPart;
                        }
                        newIntPart = intPartString;
                    }
                    else
                        i--;
                }
                else {
                    var nb = (Number(intPartString[i + intPartString.length]) + 1) % 10;
                    newIntPart = nb + "" + newIntPart;
                    if (nb !== 0) {
                        retenue = false;
                        for (var j = i + intPartString.length - 1; j > -1; j--) {
                            newIntPart = intPartString[j] + newIntPart;
                        }
                    }
                    else
                        i--;
                }
            }
        }
        else {
            var retenue = true;
            var i = precision - 1;
            while (retenue) {
                if (i > -1) {
                    var nb = Number(this.decimalPart[i]);
                    if (nb || newFracPart) {
                        newFracPart = nb.toString() + newFracPart;
                    }
                    if (nb !== 0) {
                        retenue = false;
                        for (var j = i - 1; j > -1; j--) {
                            newFracPart = this.decimalPart[j] + newFracPart;
                        }
                        newIntPart = intPartString;
                    }
                    else
                        i--;
                }
                else {
                    newIntPart = intPartString;
                    retenue = false;
                }
            }
        }
        return DecimalConstructor.fromParts(newIntPart, newFracPart);
    };
    Decimal.prototype.multiplyByPowerOfTen = function (power) {
        var newIntPart = "", newFracPart = "";
        if (power > -1) {
            newIntPart = this.intPart + "";
            for (var i = 0; i < power; i++) {
                newIntPart += i > this.decimalPart.length - 1 ? "0" : this.decimalPart[i];
            }
            newFracPart = this.decimalPart.slice(power);
        }
        else {
            var intPartString = this.intPart + "";
            newFracPart = this.decimalPart;
            for (var i = intPartString.length - 1; i > intPartString.length - 1 + power; i--) {
                newFracPart = (i < 0 ? "0" : intPartString[i]) + newFracPart;
            }
            if (power + intPartString.length < 1)
                newIntPart = "0";
            else
                newIntPart = intPartString.slice(0, power + intPartString.length);
        }
        return DecimalConstructor.fromParts(newIntPart, newFracPart);
    };
    Decimal.prototype.toTree = function () {
        return new numberNode_1.NumberNode(this.value);
    };
    return Decimal;
}());
exports.Decimal = Decimal;
