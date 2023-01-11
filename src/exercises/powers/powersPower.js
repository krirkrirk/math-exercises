"use strict";
exports.__esModule = true;
exports.getPowersPowerQuestion = exports.powersPower = exports.powersOfTenPower = void 0;
var randint_1 = require("../../mathutils/random/randint");
var power_1 = require("../../numbers/integer/power");
var latexParse_1 = require("../../tree/latexParser/latexParse");
var numberNode_1 = require("../../tree/nodes/numbers/numberNode");
var powerNode_1 = require("../../tree/nodes/operators/powerNode");
var getDistinctQuestions_1 = require("../utils/getDistinctQuestions");
/**
 * (a^b)^c
 */
exports.powersOfTenPower = {
    id: "powersOfTenPower",
    connector: "=",
    instruction: "Calculer :",
    label: "Puissance d'une puissance de 10 ",
    levels: ["4", "3", "2", "1"],
    section: "Puissances",
    isSingleStep: true,
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(function () { return getPowersPowerQuestion(true); }, nb); }
};
exports.powersPower = {
    id: "powersPower",
    connector: "=",
    instruction: "Calculer :",
    label: "Puissance d'une puissance",
    levels: ["4", "3", "2", "1"],
    section: "Puissances",
    isSingleStep: true,
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(getPowersPowerQuestion, nb); }
};
function getPowersPowerQuestion(useOnlyPowersOfTen) {
    if (useOnlyPowersOfTen === void 0) { useOnlyPowersOfTen = false; }
    var a = useOnlyPowersOfTen ? 10 : (0, randint_1.randint)(-11, 11);
    var _a = [1, 2].map(function (el) { return (0, randint_1.randint)(-11, 11); }), b = _a[0], c = _a[1];
    var statement = new powerNode_1.PowerNode(new powerNode_1.PowerNode(new numberNode_1.NumberNode(a), new numberNode_1.NumberNode(b)), new numberNode_1.NumberNode(c));
    var answerTree = new power_1.Power(a, b * c).simplify();
    var question = {
        statement: (0, latexParse_1.latexParse)(statement),
        answer: (0, latexParse_1.latexParse)(answerTree)
    };
    return question;
}
exports.getPowersPowerQuestion = getPowersPowerQuestion;
