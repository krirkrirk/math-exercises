"use strict";
exports.__esModule = true;
exports.Power = void 0;
var numberNode_1 = require("../../tree/nodes/numbers/numberNode");
var powerNode_1 = require("../../tree/nodes/operators/powerNode");
var nombre_1 = require("../nombre");
var integer_1 = require("./integer");
var Power = /** @class */ (function () {
    function Power(a, b) {
        this.operand = a;
        this.power = b;
        this.value = Math.pow(a, b);
        this.tex = "".concat(a, "^{").concat(b, "}");
        this.type = b < 0 ? nombre_1.NumberType.Rational : nombre_1.NumberType.Integer;
    }
    Power.prototype.simplify = function () {
        if (this.power === 0)
            return new numberNode_1.NumberNode(1);
        if (this.power === 1)
            return new numberNode_1.NumberNode(this.operand);
        if (this.operand === 1)
            return new numberNode_1.NumberNode(1);
        if (this.operand === 0)
            return new numberNode_1.NumberNode(0);
        if (this.operand === -1)
            return new numberNode_1.NumberNode(this.power % 2 === 0 ? 1 : -1);
        return this.toTree();
    };
    Power.prototype.toDecimalWriting = function () {
        if (this.operand !== 10)
            throw Error("only implemented for powers of ten so far");
        var s = "";
        if (this.power > -1) {
            s += "1";
            for (var i = 0; i < this.power; i++) {
                s += 0;
            }
        }
        else {
            s += "1";
            for (var i = 1; i < Math.abs(this.power); i++) {
                s = "0" + s;
            }
            s = "0." + s;
        }
        return new integer_1.Integer(Number(s), s);
    };
    Power.prototype.toTree = function () {
        return new powerNode_1.PowerNode(new numberNode_1.NumberNode(this.operand), new numberNode_1.NumberNode(this.power));
    };
    return Power;
}());
exports.Power = Power;
