"use strict";
exports.__esModule = true;
exports.getPowersOfTenDivisionQuestion = exports.powersOfTenToDecimal = void 0;
var randint_1 = require("../../mathutils/random/randint");
var power_1 = require("../../numbers/integer/power");
var latexParser_1 = require("../../tree/parsers/latexParser");
var numberNode_1 = require("../../tree/nodes/numbers/numberNode");
var powerNode_1 = require("../../tree/nodes/operators/powerNode");
var getDistinctQuestions_1 = require("../utils/getDistinctQuestions");
/**
 * 10^(-x) into 0,0...1
 */
exports.powersOfTenToDecimal = {
    id: "powersOfTenToDecimal",
    connector: "=",
    instruction: "Donner l'écriture décimale de :",
    label: "Ecriture décimale d'une puissance de 10",
    levels: ["5", "4", "3", "2"],
    section: "Puissances",
    isSingleStep: true,
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(getPowersOfTenDivisionQuestion, nb); }
};
function getPowersOfTenDivisionQuestion() {
    var randPower = (0, randint_1.randint)(-6, 8);
    var statement = new powerNode_1.PowerNode(new numberNode_1.NumberNode(10), new numberNode_1.NumberNode(randPower));
    var answerTree = new power_1.Power(10, randPower).toDecimalWriting().toTree();
    var question = {
        statement: (0, latexParser_1.latexParser)(statement),
        answer: (0, latexParser_1.latexParser)(answerTree)
    };
    return question;
}
exports.getPowersOfTenDivisionQuestion = getPowersOfTenDivisionQuestion;
