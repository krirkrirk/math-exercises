"use strict";
exports.__esModule = true;
exports.getSimpleDistributivityQuestion = exports.simpleDistributivity = void 0;
var integer_1 = require("../../../numbers/integer/integer");
var affine_1 = require("../../../polynomials/affine");
var discreteSet_1 = require("../../../sets/discreteSet");
var intervals_1 = require("../../../sets/intervals/intervals");
var latexParse_1 = require("../../../tree/latexParser/latexParse");
var numberNode_1 = require("../../../tree/nodes/numbers/numberNode");
var multiplyNode_1 = require("../../../tree/nodes/operators/multiplyNode");
var getDistinctQuestions_1 = require("../../utils/getDistinctQuestions");
exports.simpleDistributivity = {
    id: "simpleDistri",
    connector: "=",
    instruction: "Développer et réduire :",
    label: "Distributivité simple",
    levels: ["3", "2"],
    isSingleStep: false,
    section: "Calcul Littéral",
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(getSimpleDistributivityQuestion, nb); }
};
function getSimpleDistributivityQuestion() {
    var interval = new intervals_1.Interval("[[-10; 10]]").difference(new discreteSet_1.DiscreteSet([new integer_1.Integer(0)]));
    var affine = affine_1.AffineConstructor.random(interval, interval);
    var coeff = interval.getRandomElement();
    var statementTree = new multiplyNode_1.MultiplyNode(new numberNode_1.NumberNode(coeff.value), affine.toTree());
    var answerTree = affine.times(coeff.value).toTree();
    return {
        statement: (0, latexParse_1.latexParse)(statementTree),
        answer: (0, latexParse_1.latexParse)(answerTree)
    };
}
exports.getSimpleDistributivityQuestion = getSimpleDistributivityQuestion;
