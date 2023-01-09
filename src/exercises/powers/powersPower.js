"use strict";
exports.__esModule = true;
exports.getPowersPowerQuestion = exports.powersPower = void 0;
var randint_1 = require("../../mathutils/random/randint");
var power_1 = require("../../numbers/integer/power");
var latexParse_1 = require("../../tree/latexParser/latexParse");
var numberNode_1 = require("../../tree/nodes/numbers/numberNode");
var powerNode_1 = require("../../tree/nodes/operators/powerNode");
var getDistinctQuestions_1 = require("../utils/getDistinctQuestions");
/**
 * (a^b)^c
 */
exports.powersPower = {
    id: "powersPower",
    connector: "=",
    instruction: "Calculer :",
    label: "Puissance d'une puissance",
    levels: ["4", "3", "2", "1"],
    section: "Calculs",
    isSingleStep: true,
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(getPowersPowerQuestion, nb); }
};
function getPowersPowerQuestion() {
    var _a = [1, 2, 3].map(function (el) { return (0, randint_1.randint)(-11, 11); }), a = _a[0], b = _a[1], c = _a[2];
    var statement = new powerNode_1.PowerNode(new powerNode_1.PowerNode(new numberNode_1.NumberNode(a), new numberNode_1.NumberNode(b)), new numberNode_1.NumberNode(c));
    var answerTree = new power_1.Power(a, b * c).simplify();
    var question = {
        statement: (0, latexParse_1.latexParse)(statement),
        answer: (0, latexParse_1.latexParse)(answerTree)
    };
    return question;
}
exports.getPowersPowerQuestion = getPowersPowerQuestion;
