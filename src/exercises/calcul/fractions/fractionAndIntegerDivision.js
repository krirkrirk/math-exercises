"use strict";
exports.__esModule = true;
exports.getFractionAndIntegerDivision = exports.fractionAndIntegerDivision = void 0;
var randint_1 = require("../../../mathutils/random/randint");
var integer_1 = require("../../../numbers/integer/integer");
var rational_1 = require("../../../numbers/rationals/rational");
var latexParse_1 = require("../../../tree/latexParser/latexParse");
var divideNode_1 = require("../../../tree/nodes/operators/divideNode");
var random_1 = require("../../../utils/random");
var getDistinctQuestions_1 = require("../../utils/getDistinctQuestions");
exports.fractionAndIntegerDivision = {
    id: "fractionAndIntegerDivision",
    connector: "=",
    instruction: "Calculer la forme irréductible :",
    label: "Division d'un entier et d'une fraction",
    levels: ["4", "3", "2", "1"],
    isSingleStep: false,
    section: "Fractions",
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(getFractionAndIntegerDivision, nb); }
};
function getFractionAndIntegerDivision() {
    var rational = rational_1.RationalConstructor.randomIrreductible();
    var integer = new integer_1.Integer((0, randint_1.randint)(-10, 11, [0]));
    var integerFirst = (0, random_1.random)([0, 1]);
    var statementTree = integerFirst
        ? new divideNode_1.DivideNode(integer.toTree(), rational.toTree())
        : new divideNode_1.DivideNode(rational.toTree(), integer.toTree());
    var answerTree = integerFirst ? integer.divide(rational).toTree() : rational.divide(integer).toTree();
    var question = {
        statement: (0, latexParse_1.latexParse)(statementTree),
        answer: (0, latexParse_1.latexParse)(answerTree)
    };
    return question;
}
exports.getFractionAndIntegerDivision = getFractionAndIntegerDivision;
