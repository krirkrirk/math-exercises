"use strict";
exports.__esModule = true;
exports.getAddAndSubQuestions = exports.addAndSubExercise = void 0;
var randint_1 = require("../../mathutils/random/randint");
var latexParse_1 = require("../../tree/latexParser/latexParse");
var numberNode_1 = require("../../tree/nodes/numbers/numberNode");
var addNode_1 = require("../../tree/nodes/operators/addNode");
var getDistinctQuestions_1 = require("../utils/getDistinctQuestions");
/**
 * a±b±c±d
 */
exports.addAndSubExercise = {
    id: "addAndSub",
    connector: "=",
    instruction: "Calculer :",
    label: "Additions et soustractions",
    levels: ["6", "5"],
    section: "Calculs",
    isSingleStep: true,
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(getAddAndSubQuestions, nb); }
};
function getAddAndSubQuestions() {
    var nbOperations = (0, randint_1.randint)(2, 4);
    var numbers = [];
    for (var i = 0; i < nbOperations + 1; i++) {
        numbers.push((0, randint_1.randint)(-15, 15, [0]));
    }
    var allNumbersNodes = numbers.map(function (nb) { return new numberNode_1.NumberNode(nb); });
    var statementTree = new addNode_1.AddNode(allNumbersNodes[0], allNumbersNodes[1]);
    for (var i = 2; i < allNumbersNodes.length; i++) {
        statementTree = new addNode_1.AddNode(statementTree, allNumbersNodes[i]);
    }
    var answer = numbers.reduce(function (a, b) { return a + b; }) + "";
    var question = {
        statement: (0, latexParse_1.latexParse)(statementTree),
        answer: answer
    };
    return question;
}
exports.getAddAndSubQuestions = getAddAndSubQuestions;
