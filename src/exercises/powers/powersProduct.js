"use strict";
exports.__esModule = true;
exports.getPowersProductQuestion = exports.powersProduct = exports.powersOfTenProduct = void 0;
var randint_1 = require("../../mathutils/random/randint");
var power_1 = require("../../numbers/integer/power");
var latexParser_1 = require("../../tree/parsers/latexParser");
var numberNode_1 = require("../../tree/nodes/numbers/numberNode");
var multiplyNode_1 = require("../../tree/nodes/operators/multiplyNode");
var powerNode_1 = require("../../tree/nodes/operators/powerNode");
var getDistinctQuestions_1 = require("../utils/getDistinctQuestions");
/**
 * a^b*a^c
 */
exports.powersOfTenProduct = {
    id: "powersOfTenProduct",
    connector: "=",
    instruction: "Calculer :",
    label: "Multiplication de puissances de 10",
    levels: ["4", "3", "2", "1"],
    section: "Puissances",
    isSingleStep: true,
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(function () { return getPowersProductQuestion(true); }, nb); }
};
exports.powersProduct = {
    id: "powersProduct",
    connector: "=",
    instruction: "Calculer :",
    label: "Multiplication de puissances",
    levels: ["4", "3", "2", "1"],
    section: "Puissances",
    isSingleStep: true,
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(getPowersProductQuestion, nb); }
};
function getPowersProductQuestion(useOnlyPowersOfTen) {
    if (useOnlyPowersOfTen === void 0) { useOnlyPowersOfTen = false; }
    var a = useOnlyPowersOfTen ? 10 : (0, randint_1.randint)(-11, 11);
    var _a = [1, 2].map(function (el) { return (0, randint_1.randint)(-11, 11); }), b = _a[0], c = _a[1];
    var statement = new multiplyNode_1.MultiplyNode(new powerNode_1.PowerNode(new numberNode_1.NumberNode(a), new numberNode_1.NumberNode(b)), new powerNode_1.PowerNode(new numberNode_1.NumberNode(a), new numberNode_1.NumberNode(c)));
    var answerTree = new power_1.Power(a, b + c).simplify();
    var question = {
        statement: (0, latexParser_1.latexParser)(statement),
        answer: (0, latexParser_1.latexParser)(answerTree)
    };
    return question;
}
exports.getPowersProductQuestion = getPowersProductQuestion;
