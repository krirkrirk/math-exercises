"use strict";
exports.__esModule = true;
exports.getFractionsProduct = exports.fractionsProduct = void 0;
var rational_1 = require("../../../numbers/rationals/rational");
var latexParser_1 = require("../../../tree/parsers/latexParser");
var multiplyNode_1 = require("../../../tree/nodes/operators/multiplyNode");
var getDistinctQuestions_1 = require("../../utils/getDistinctQuestions");
exports.fractionsProduct = {
    id: "fractionsProduct",
    connector: "=",
    instruction: "Calculer la forme irréductible :",
    label: "Produits de fractions",
    levels: ["4", "3", "2", "1"],
    section: "Fractions",
    isSingleStep: false,
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(getFractionsProduct, nb); }
};
function getFractionsProduct() {
    var rational = rational_1.RationalConstructor.randomIrreductible();
    var rational2 = rational_1.RationalConstructor.randomIrreductible();
    var statementTree = new multiplyNode_1.MultiplyNode(rational.toTree(), rational2.toTree());
    var answerTree = rational.multiply(rational2).toTree();
    var question = {
        startStatement: (0, latexParser_1.latexParser)(statementTree),
        answer: (0, latexParser_1.latexParser)(answerTree)
    };
    return question;
}
exports.getFractionsProduct = getFractionsProduct;
