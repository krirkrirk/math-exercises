"use strict";
exports.__esModule = true;
exports.getEquationType3ExerciseQuestion = exports.equationType3Exercise = void 0;
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
 *  type ax+b=c
 */
exports.equationType3Exercise = {
    connector: "\\iff",
    instruction: "Résoudre : ",
    label: "Equations $ax+b=c$",
    levels: ["4", "3", "2"],
    section: "Calcul littéral",
    generator: function (nb) {
        return (0, getDistinctQuestions_1.getDistinctQuestions)(getEquationType3ExerciseQuestion, nb);
    }
};
function getEquationType3ExerciseQuestion() {
    var interval = new intervals_1.Interval("[[-10; 10]]");
    var intervalStar = new intervals_1.Interval("[[-10; 10]]").difference(new discreteSet_1.DiscreteSet([new integer_1.Integer(0)]));
    var b = intervalStar.getRandomElement();
    var a = intervalStar.getRandomElement();
    var c = interval.getRandomElement();
    var affine = new affine_1.Affine(a.value, b.value).toTree();
    var solution = new rational_1.Rational(c.value - b.value, a.value).simplify();
    var statementTree = new equalNode_1.EqualNode(affine, c.toTree());
    var answerTree = new equalNode_1.EqualNode(new variableNode_1.VariableNode("x"), solution.toTree());
    var question = {
        statement: (0, latexParse_1.latexParse)(statementTree),
        answer: (0, latexParse_1.latexParse)(answerTree)
    };
    return question;
}
exports.getEquationType3ExerciseQuestion = getEquationType3ExerciseQuestion;
