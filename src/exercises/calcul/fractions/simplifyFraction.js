"use strict";
exports.__esModule = true;
exports.getSimplifyFraction = exports.simplifyFraction = void 0;
var rational_1 = require("../../../numbers/rationals/rational");
var latexParse_1 = require("../../../tree/latexParser/latexParse");
var getDistinctQuestions_1 = require("../../utils/getDistinctQuestions");
exports.simplifyFraction = {
    id: "simplifySqrt",
    connector: "=",
    instruction: "Simplifier :",
    label: "Simplification de racines carrées",
    levels: ["3", "2", "1"],
    section: "Racines carrées",
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(getSimplifyFraction, nb); }
};
function getSimplifyFraction() {
    var rational = rational_1.RationalConstructor.randomSimplifiable(10);
    var question = {
        statement: (0, latexParse_1.latexParse)(rational.toTree()),
        answer: (0, latexParse_1.latexParse)(rational.simplify().toTree())
    };
    return question;
}
exports.getSimplifyFraction = getSimplifyFraction;
