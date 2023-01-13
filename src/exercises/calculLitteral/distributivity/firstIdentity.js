"use strict";
exports.__esModule = true;
exports.getFirstIdentityQuestion = exports.firstIdentity = void 0;
var integer_1 = require("../../../numbers/integer/integer");
var affine_1 = require("../../../polynomials/affine");
var discreteSet_1 = require("../../../sets/discreteSet");
var intervals_1 = require("../../../sets/intervals/intervals");
var latexParser_1 = require("../../../tree/parsers/latexParser");
var numberNode_1 = require("../../../tree/nodes/numbers/numberNode");
var powerNode_1 = require("../../../tree/nodes/operators/powerNode");
var getDistinctQuestions_1 = require("../../utils/getDistinctQuestions");
exports.firstIdentity = {
    id: "idRmq1",
    connector: "=",
    instruction: "Développer et réduire :",
    label: "Identité remarquable $(a+b)^2$",
    levels: ["3", "2"],
    isSingleStep: false,
    section: "Calcul littéral",
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(getFirstIdentityQuestion, nb); }
};
function getFirstIdentityQuestion() {
    var interval = new intervals_1.Interval("[[1; 10]]").difference(new discreteSet_1.DiscreteSet([new integer_1.Integer(0)]));
    var affine = affine_1.AffineConstructor.random(interval, interval);
    var statementTree = new powerNode_1.PowerNode(affine.toTree(), new numberNode_1.NumberNode(2));
    var answerTree = affine.multiply(affine).toTree();
    return {
        statement: (0, latexParser_1.latexParser)(statementTree),
        answer: (0, latexParser_1.latexParser)(answerTree)
    };
}
exports.getFirstIdentityQuestion = getFirstIdentityQuestion;
