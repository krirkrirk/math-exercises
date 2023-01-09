"use strict";
exports.__esModule = true;
exports.getThirdIdentityQuestion = exports.thirdIdentity = void 0;
var integer_1 = require("../../../numbers/integer/integer");
var affine_1 = require("../../../polynomials/affine");
var discreteSet_1 = require("../../../sets/discreteSet");
var intervals_1 = require("../../../sets/intervals/intervals");
var latexParse_1 = require("../../../tree/latexParser/latexParse");
var multiplyNode_1 = require("../../../tree/nodes/operators/multiplyNode");
var getDistinctQuestions_1 = require("../../utils/getDistinctQuestions");
exports.thirdIdentity = {
    id: "idRmq3",
    connector: "=",
    instruction: "Développer et réduire :",
    label: "Identité remarquable $(a+b)(a-b)$",
    levels: ["3", "2"],
    isSingleStep: false,
    section: "Calcul Littéral",
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(getThirdIdentityQuestion, nb); }
};
function getThirdIdentityQuestion() {
    var interval = new intervals_1.Interval("[[-10; 10]]").difference(new discreteSet_1.DiscreteSet([new integer_1.Integer(0)]));
    var affine = affine_1.AffineConstructor.random(interval, interval);
    var affine2 = new affine_1.Affine(affine.a, -affine.b);
    var statementTree = new multiplyNode_1.MultiplyNode(affine.toTree(), affine2.toTree());
    var answerTree = affine.multiply(affine2).toTree();
    return {
        statement: (0, latexParse_1.latexParse)(statementTree),
        answer: (0, latexParse_1.latexParse)(answerTree)
    };
}
exports.getThirdIdentityQuestion = getThirdIdentityQuestion;
