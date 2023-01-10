"use strict";
exports.__esModule = true;
exports.Integer = exports.IntegerConstructor = void 0;
var randint_1 = require("../../mathutils/random/randint");
var numberNode_1 = require("../../tree/nodes/numbers/numberNode");
var nombre_1 = require("../nombre");
var rational_1 = require("../rationals/rational");
var IntegerConstructor = /** @class */ (function () {
    function IntegerConstructor() {
    }
    IntegerConstructor.random = function (nbOfDigits) {
        return (0, randint_1.randint)(0, Math.pow(10, nbOfDigits));
    };
    return IntegerConstructor;
}());
exports.IntegerConstructor = IntegerConstructor;
var Integer = /** @class */ (function () {
    function Integer(value, tex) {
        this.value = value;
        this.tex = tex || value + "";
        this.type = nombre_1.NumberType.Integer;
    }
    Integer.prototype.toTree = function () {
        return new numberNode_1.NumberNode(this.value, this.tex);
    };
    Integer.prototype.round = function (precision) {
        var intString = this.value + "";
        if (precision >= intString.length || precision < 1)
            throw Error("can't round to higher precision");
        var newInt = "";
        var shouldRoundUp = Number(intString[intString.length - precision]) > 4;
        if (shouldRoundUp) {
            for (var i_1 = 0; i_1 < precision; i_1++) {
                newInt += "0";
            }
            var retenue = true;
            var i = intString.length - precision - 1;
            while (retenue) {
                var nb = (Number(intString[i]) + 1) % 10;
                newInt = "" + nb + newInt;
                if (nb === 0) {
                    i--;
                }
                else {
                    retenue = false;
                    for (var j = i - 1; j > -1; j--) {
                        newInt = intString[j] + newInt;
                    }
                }
            }
        }
        else {
            for (var i = 0; i < intString.length; i++) {
                newInt += i < intString.length - precision ? intString[i] : "0";
            }
        }
        return new Integer(Number(newInt));
    };
    Integer.prototype.divide = function (nb) {
        switch (nb.type) {
            case nombre_1.NumberType.Integer:
                return new rational_1.Rational(this.value, nb.value).simplify();
            case nombre_1.NumberType.Rational:
                var rational = nb;
                return new rational_1.Rational(this.value * rational.denum, rational.num).simplify();
            default:
                throw Error("not implemented");
        }
    };
    return Integer;
}());
exports.Integer = Integer;
