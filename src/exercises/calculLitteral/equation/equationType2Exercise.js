"use strict";
exports.__esModule = true;
exports.getEquationType2ExerciseQuestion = exports.equationType2Exercise = void 0;
var integer_1 = require("../../../numbers/integer/integer");
var rational_1 = require("../../../numbers/rationals/rational");
var affine_1 = require("../../../polynomials/affine");
var discreteSet_1 = require("../../../sets/discreteSet");
var intervals_1 = require("../../../sets/intervals/intervals");
var latexParse_1 = require("../../../tree/latexParser/latexParse");
var equalNode_1 = require("../../../tree/nodes/operators/equalNode");
var variableNode_1 = require("../../../tree/nodes/variables/variableNode");
var getDistinctQuestions_1 = require("../../utils/getDistinctQuestions");
/**
 *  type ax=b
 */
exports.equationType2Exercise = {
    id: "equa2",
    connector: "\\iff",
    instruction: "Résoudre : ",
    label: "Equations $ax=b$",
    levels: ["4", "3", "2"],
    section: "Calcul littéral",
    isSingleStep: true,
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(getEquationType2ExerciseQuestion, nb); }
};
function getEquationType2ExerciseQuestion() {
    var interval = new intervals_1.Interval("[[-10; 10]]");
    var intervalStar = new intervals_1.Interval("[[-10; 10]]").difference(new discreteSet_1.DiscreteSet([new integer_1.Integer(0)]));
    var b = interval.getRandomElement();
    var a = intervalStar.getRandomElement();
    var solution = new rational_1.Rational(b.value, a.value).simplify();
    var affine = new affine_1.Affine(a.value, 0).toTree();
    var tree = new equalNode_1.EqualNode(affine, b.toTree());
    var answer = new equalNode_1.EqualNode(new variableNode_1.VariableNode("x"), solution.toTree());
    var question = {
        statement: (0, latexParse_1.latexParse)(tree),
        answer: (0, latexParse_1.latexParse)(answer)
    };
    return question;
}
exports.getEquationType2ExerciseQuestion = getEquationType2ExerciseQuestion;
