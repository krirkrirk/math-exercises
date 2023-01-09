"use strict";
exports.__esModule = true;
exports.getFractionsDivision = exports.fractionsDivision = void 0;
var rational_1 = require("../../../numbers/rationals/rational");
var latexParse_1 = require("../../../tree/latexParser/latexParse");
var divideNode_1 = require("../../../tree/nodes/operators/divideNode");
var getDistinctQuestions_1 = require("../../utils/getDistinctQuestions");
exports.fractionsDivision = {
    id: "fractionsDivision",
    connector: "=",
    instruction: "Calculer la forme irréductible :",
    label: "Divisions de fractions",
    levels: ["4", "3", "2", "1"],
    section: "Fractions",
    isSingleStep: false,
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(getFractionsDivision, nb); }
};
function getFractionsDivision() {
    var rational = rational_1.RationalConstructor.randomIrreductible();
    var rational2 = rational_1.RationalConstructor.randomIrreductible();
    var statementTree = new divideNode_1.DivideNode(rational.toTree(), rational2.toTree());
    var answerTree = rational.divide(rational2).toTree();
    var question = {
        statement: (0, latexParse_1.latexParse)(statementTree),
        answer: (0, latexParse_1.latexParse)(answerTree)
    };
    return question;
}
exports.getFractionsDivision = getFractionsDivision;
