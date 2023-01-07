"use strict";
/**
 *  type (ax+b)(cx+d) ± (ax+b)(ex+f)
 */
exports.__esModule = true;
exports.getSimplifySquareRoot = exports.simplifySquareRoot = void 0;
var squareRoot_1 = require("../../numbers/reals/squareRoot");
var latexParse_1 = require("../../tree/latexParser/latexParse");
var getDistinctQuestions_1 = require("../utils/getDistinctQuestions");
exports.simplifySquareRoot = {
    connector: "=",
    instruction: "Simplifier :",
    label: "Simplification de racines carrées",
    levels: ["3", "2", "1"],
    section: "Racines carrées",
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(getSimplifySquareRoot, nb); }
};
function getSimplifySquareRoot() {
    var squareRoot = squareRoot_1.SquareRootConstructor.randomSimplifiable({
        allowPerfectSquare: false,
        maxSquare: 11
    });
    var question = {
        statement: (0, latexParse_1.latexParse)(squareRoot.toTree()),
        answer: (0, latexParse_1.latexParse)(squareRoot.simplify().toTree())
    };
    return question;
}
exports.getSimplifySquareRoot = getSimplifySquareRoot;
