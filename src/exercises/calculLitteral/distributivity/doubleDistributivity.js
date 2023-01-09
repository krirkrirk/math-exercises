"use strict";
exports.__esModule = true;
exports.getDoubleDistributivityQuestion = exports.doubleDistributivity = void 0;
var integer_1 = require("../../../numbers/integer/integer");
var affine_1 = require("../../../polynomials/affine");
var discreteSet_1 = require("../../../sets/discreteSet");
var intervals_1 = require("../../../sets/intervals/intervals");
var latexParse_1 = require("../../../tree/latexParser/latexParse");
var multiplyNode_1 = require("../../../tree/nodes/operators/multiplyNode");
var getDistinctQuestions_1 = require("../../utils/getDistinctQuestions");
exports.doubleDistributivity = {
    id: "doubleDistri",
    connector: "=",
    instruction: "Développer et réduire :",
    label: "Distributivité double",
    levels: ["3", "2"],
    isSingleStep: false,
    section: "Calcul Littéral",
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(getDoubleDistributivityQuestion, nb); }
};
function getDoubleDistributivityQuestion() {
    var interval = new intervals_1.Interval("[[-10; 10]]").difference(new discreteSet_1.DiscreteSet([new integer_1.Integer(0)]));
    var affines = affine_1.AffineConstructor.differentRandoms(2, interval, interval);
    var statementTree = new multiplyNode_1.MultiplyNode(affines[0].toTree(), affines[1].toTree());
    var answerTree = affines[0].multiply(affines[1]).toTree();
    return {
        statement: (0, latexParse_1.latexParse)(statementTree),
        answer: (0, latexParse_1.latexParse)(answerTree)
    };
}
exports.getDoubleDistributivityQuestion = getDoubleDistributivityQuestion;
