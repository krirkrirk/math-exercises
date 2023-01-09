"use strict";
exports.__esModule = true;
exports.getSecondIdentityQuestion = exports.secondIdentity = void 0;
var integer_1 = require("../../../numbers/integer/integer");
var affine_1 = require("../../../polynomials/affine");
var discreteSet_1 = require("../../../sets/discreteSet");
var intervals_1 = require("../../../sets/intervals/intervals");
var latexParse_1 = require("../../../tree/latexParser/latexParse");
var numberNode_1 = require("../../../tree/nodes/numbers/numberNode");
var powerNode_1 = require("../../../tree/nodes/operators/powerNode");
var getDistinctQuestions_1 = require("../../utils/getDistinctQuestions");
exports.secondIdentity = {
    id: "idRmq2",
    connector: "=",
    instruction: "Développer et réduire :",
    label: "Identité remarquable $(a-b)^2$",
    levels: ["3", "2"],
    isSingleStep: false,
    section: "Calcul Littéral",
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(getSecondIdentityQuestion, nb); }
};
function getSecondIdentityQuestion() {
    var intervalA = new intervals_1.Interval("[[0; 10]]").difference(new discreteSet_1.DiscreteSet([new integer_1.Integer(0)]));
    var intervalB = new intervals_1.Interval("[[-10; 0]]").difference(new discreteSet_1.DiscreteSet([new integer_1.Integer(0)]));
    var affine = affine_1.AffineConstructor.random(intervalA, intervalB);
    var statementTree = new powerNode_1.PowerNode(affine.toTree(), new numberNode_1.NumberNode(2));
    var answerTree = affine.multiply(affine).toTree();
    return {
        statement: (0, latexParse_1.latexParse)(statementTree),
        answer: (0, latexParse_1.latexParse)(answerTree)
    };
}
exports.getSecondIdentityQuestion = getSecondIdentityQuestion;
