"use strict";
exports.__esModule = true;
exports.getFractionsSum = exports.fractionsSum = void 0;
var rational_1 = require("../../../numbers/rationals/rational");
var latexParser_1 = require("../../../tree/parsers/latexParser");
var addNode_1 = require("../../../tree/nodes/operators/addNode");
var getDistinctQuestions_1 = require("../../utils/getDistinctQuestions");
exports.fractionsSum = {
    id: "fractionsSum",
    connector: "=",
    instruction: "Calculer la forme irréductible :",
    label: "Sommes de fractions",
    levels: ["4", "3", "2", "1"],
    section: "Fractions",
    isSingleStep: false,
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(getFractionsSum, nb); }
};
function getFractionsSum() {
    var rational = rational_1.RationalConstructor.randomIrreductible();
    var rational2 = rational_1.RationalConstructor.randomIrreductible();
    var statementTree = new addNode_1.AddNode(rational.toTree(), rational2.toTree());
    var answerTree = rational.add(rational2).toTree();
    var question = {
        statement: (0, latexParser_1.latexParser)(statementTree),
        answer: (0, latexParser_1.latexParser)(answerTree)
    };
    return question;
}
exports.getFractionsSum = getFractionsSum;
