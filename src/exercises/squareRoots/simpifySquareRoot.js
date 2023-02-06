"use strict";
exports.__esModule = true;
exports.getSimplifySquareRoot = exports.simplifySquareRoot = void 0;
var squareRoot_1 = require("../../numbers/reals/squareRoot");
var latexParser_1 = require("../../tree/parsers/latexParser");
var getDistinctQuestions_1 = require("../utils/getDistinctQuestions");
exports.simplifySquareRoot = {
    id: "simplifySqrt",
    connector: "=",
    instruction: "Simplifier :",
    label: "Simplification de racines carrées",
    levels: ["3", "2", "1"],
    isSingleStep: false,
    section: "Racines carrées",
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(getSimplifySquareRoot, nb); }
};
function getSimplifySquareRoot() {
    var squareRoot = squareRoot_1.SquareRootConstructor.randomSimplifiable({
        allowPerfectSquare: false,
        maxSquare: 11
    });
    var question = {
        startStatement: (0, latexParser_1.latexParser)(squareRoot.toTree()),
        answer: (0, latexParser_1.latexParser)(squareRoot.simplify().toTree())
    };
    return question;
}
exports.getSimplifySquareRoot = getSimplifySquareRoot;
