"use strict";
exports.__esModule = true;
exports.getAddAndSubQuestions = exports.addAndSubExercise = void 0;
var latex_1 = require("../../latex/latex");
var randint_1 = require("../../mathutils/random/randint");
var intervals_1 = require("../../sets/intervals/intervals");
var getDistinctQuestions_1 = require("../utils/getDistinctQuestions");
/**
 * a±b±c±d
 */
exports.addAndSubExercise = {
    connector: "=",
    instruction: "Calculer :",
    label: "Additions et soustractions",
    levels: ["6", "5"],
    section: "Calculs",
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(getAddAndSubQuestions, nb); }
};
function getAddAndSubQuestions() {
    var nbOfTerms = (0, randint_1.randint)(3, 5);
    var max = 20;
    var terms = [];
    var interval = new intervals_1.Interval("[[".concat(-max, "; ").concat(max, "]]")).exclude(0);
    for (var i = 0; i < nbOfTerms; i++) {
        terms.push(interval.getRandomElement());
    }
    var tex = new latex_1.Latex("");
    terms.forEach(function (term) { return tex.add(term); });
    var statement = tex.toTex();
    var answer = terms.reduce(function (acc, curr) { return acc + curr; }).toString();
    var question = { statement: statement, answer: answer };
    return question;
}
exports.getAddAndSubQuestions = getAddAndSubQuestions;
