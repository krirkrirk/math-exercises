"use strict";
exports.__esModule = true;
exports.getFractionAndIntegerProduct = exports.fractionAndIntegerProduct = void 0;
var randint_1 = require("../../../mathutils/random/randint");
var integer_1 = require("../../../numbers/integer/integer");
var rational_1 = require("../../../numbers/rationals/rational");
var latexParser_1 = require("../../../tree/parsers/latexParser");
var multiplyNode_1 = require("../../../tree/nodes/operators/multiplyNode");
var getDistinctQuestions_1 = require("../../utils/getDistinctQuestions");
exports.fractionAndIntegerProduct = {
    id: "fractionAndIntegerProduct",
    connector: "=",
    instruction: "Calculer la forme irréductible :",
    label: "Produit d'un entier et d'une fraction",
    levels: ["4", "3", "2", "1"],
    isSingleStep: false,
    section: "Fractions",
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(getFractionAndIntegerProduct, nb); }
};
function getFractionAndIntegerProduct() {
    var rational = rational_1.RationalConstructor.randomIrreductible();
    var integer = new integer_1.Integer((0, randint_1.randint)(-10, 11, [0]));
    var statementTree = new multiplyNode_1.MultiplyNode(rational.toTree(), integer.toTree()).shuffle();
    var answerTree = rational.multiply(integer).toTree();
    var question = {
        startStatement: (0, latexParser_1.latexParser)(statementTree),
        answer: (0, latexParser_1.latexParser)(answerTree)
    };
    return question;
}
exports.getFractionAndIntegerProduct = getFractionAndIntegerProduct;
