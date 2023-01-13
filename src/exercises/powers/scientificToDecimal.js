"use strict";
exports.__esModule = true;
exports.getScientificToDecimalQuestion = exports.scientificToDecimal = void 0;
var randint_1 = require("../../mathutils/random/randint");
var decimal_1 = require("../../numbers/decimals/decimal");
var integer_1 = require("../../numbers/integer/integer");
var latexParser_1 = require("../../tree/parsers/latexParser");
var numberNode_1 = require("../../tree/nodes/numbers/numberNode");
var multiplyNode_1 = require("../../tree/nodes/operators/multiplyNode");
var powerNode_1 = require("../../tree/nodes/operators/powerNode");
var getDistinctQuestions_1 = require("../utils/getDistinctQuestions");
/**
 * a*10^x vers décimal
 *  */
exports.scientificToDecimal = {
    id: "scientificToDecimal",
    connector: "=",
    instruction: "Donner l'écriture décimale de :",
    label: "Ecriture décimale de $a\\times 10^x$",
    levels: ["5", "4", "3", "2"],
    section: "Puissances",
    isSingleStep: true,
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(getScientificToDecimalQuestion, nb); }
};
function getScientificToDecimalQuestion() {
    var randPower = (0, randint_1.randint)(-6, 8);
    var int = integer_1.IntegerConstructor.random((0, randint_1.randint)(1, 4));
    var fracPart = decimal_1.DecimalConstructor.randomFracPart((0, randint_1.randint)(0, 4));
    var randDecimal = decimal_1.DecimalConstructor.fromParts(int + "", fracPart);
    var statement = new multiplyNode_1.MultiplyNode(new numberNode_1.NumberNode(randDecimal.value), new powerNode_1.PowerNode(new numberNode_1.NumberNode(10), new numberNode_1.NumberNode(randPower)));
    var answerTree = randDecimal.multiplyByPowerOfTen(randPower).toTree();
    var question = {
        statement: (0, latexParser_1.latexParser)(statement),
        answer: (0, latexParser_1.latexParser)(answerTree)
    };
    return question;
}
exports.getScientificToDecimalQuestion = getScientificToDecimalQuestion;
