"use strict";
exports.__esModule = true;
exports.getEquationType4ExerciseQuestion = exports.equationType4Exercise = void 0;
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
 *  type ax+b=cx+d
 */
exports.equationType4Exercise = {
    connector: "\\iff",
    instruction: "Résoudre : ",
    label: "Equations $ax+b=cx+d$",
    levels: ["4", "3", "2"],
    section: "Calcul littéral",
    generator: function (nb) {
        return (0, getDistinctQuestions_1.getDistinctQuestions)(getEquationType4ExerciseQuestion, nb);
    }
};
function getEquationType4ExerciseQuestion() {
    var interval = new intervals_1.Interval("[[-10; 10]]");
    var intervalStar = new intervals_1.Interval("[[-10; 10]]").difference(new discreteSet_1.DiscreteSet([new integer_1.Integer(0)]));
    var a = intervalStar.getRandomElement();
    var b = interval.getRandomElement();
    var intervalC = new intervals_1.Interval("[[-10; 10]]").difference(new discreteSet_1.DiscreteSet([new integer_1.Integer(0), new integer_1.Integer(a.value)]));
    var c = intervalC.getRandomElement();
    var d = interval.getRandomElement();
    var affines = [new affine_1.Affine(a.value, b.value), new affine_1.Affine(c.value, d.value)];
    var solution = new rational_1.Rational(d.value - b.value, a.value - c.value).simplify();
    var statementTree = new equalNode_1.EqualNode(affines[0].toTree(), affines[1].toTree());
    var answerTree = new equalNode_1.EqualNode(new variableNode_1.VariableNode("x"), solution.toTree());
    var question = {
        statement: (0, latexParse_1.latexParse)(statementTree),
        answer: (0, latexParse_1.latexParse)(answerTree)
    };
    return question;
}
exports.getEquationType4ExerciseQuestion = getEquationType4ExerciseQuestion;
