"use strict";
exports.__esModule = true;
exports.getFractionAndIntegerSum = exports.fractionAndIntegerSum = void 0;
var randint_1 = require("../../../mathutils/random/randint");
var integer_1 = require("../../../numbers/integer/integer");
var rational_1 = require("../../../numbers/rationals/rational");
var latexParser_1 = require("../../../tree/parsers/latexParser");
var addNode_1 = require("../../../tree/nodes/operators/addNode");
var getDistinctQuestions_1 = require("../../utils/getDistinctQuestions");
exports.fractionAndIntegerSum = {
    id: "fractionAndIntegerSum",
    connector: "=",
    instruction: "Calculer la forme irréductible :",
    label: "Somme d'un entier et d'une fraction",
    levels: ["4", "3", "2", "1"],
    isSingleStep: false,
    section: "Fractions",
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(getFractionAndIntegerSum, nb); }
};
function getFractionAndIntegerSum() {
    var rational = rational_1.RationalConstructor.randomIrreductible();
    var integer = new integer_1.Integer((0, randint_1.randint)(-10, 11, [0]));
    var statementTree = new addNode_1.AddNode(rational.toTree(), integer.toTree());
    statementTree.shuffle();
    var answerTree = rational.add(integer).toTree();
    var question = {
        startStatement: (0, latexParser_1.latexParser)(statementTree),
        answer: (0, latexParser_1.latexParser)(answerTree)
    };
    return question;
}
exports.getFractionAndIntegerSum = getFractionAndIntegerSum;
