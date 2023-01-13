"use strict";
exports.__esModule = true;
exports.getEquationType1ExerciseQuestion = exports.equationType1Exercise = void 0;
var integer_1 = require("../../../numbers/integer/integer");
var affine_1 = require("../../../polynomials/affine");
var discreteSet_1 = require("../../../sets/discreteSet");
var intervals_1 = require("../../../sets/intervals/intervals");
var latexParse_1 = require("../../../tree/latexParser/latexParse");
var equalNode_1 = require("../../../tree/nodes/operators/equalNode");
var getDistinctQuestions_1 = require("../../utils/getDistinctQuestions");
/**
 *  type x+a=b
 */
exports.equationType1Exercise = {
    id: "equa1",
    connector: "\\iff",
    instruction: "Résoudre : ",
    label: "Equations $x+a = b$",
    levels: ["4", "3", "2"],
    section: "Calcul littéral",
    isSingleStep: true,
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(getEquationType1ExerciseQuestion, nb); }
};
function getEquationType1ExerciseQuestion() {
    var interval = new intervals_1.Interval("[[-10; 10]]");
    var intervalStar = new intervals_1.Interval("[[-10; 10]]").difference(new discreteSet_1.DiscreteSet([new integer_1.Integer(0)]));
    var b = interval.getRandomElement();
    var a = intervalStar.getRandomElement();
    var solution = b.value - a.value;
    var affine = new affine_1.Affine(1, a.value).toTree();
    var tree = new equalNode_1.EqualNode(affine, b.toTree());
    var question = {
        statement: (0, latexParse_1.latexParse)(tree),
        answer: "x = ".concat(solution)
    };
    return question;
}
exports.getEquationType1ExerciseQuestion = getEquationType1ExerciseQuestion;
