"use strict";
exports.__esModule = true;
exports.getSimpleDistributivityQuestion = exports.simpleDistributivity = void 0;
var integer_1 = require("../../../numbers/integer/integer");
var multiply_1 = require("../../../operations/multiply");
var affine_1 = require("../../../polynomials/affine");
var discreteSet_1 = require("../../../sets/discreteSet");
var intervals_1 = require("../../../sets/intervals/intervals");
var getDistinctQuestions_1 = require("../../utils/getDistinctQuestions");
exports.simpleDistributivity = {
    connector: "=",
    instruction: "Développer et réduire :",
    label: "Distributivité simple",
    levels: ["3", "2"],
    section: "Calcul Littéral",
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(getSimpleDistributivityQuestion, nb); }
};
function getSimpleDistributivityQuestion() {
    var interval = new intervals_1.Interval("[[-10; 10]]").difference(new discreteSet_1.DiscreteSet([new integer_1.Integer(0, "0")]));
    var affine = affine_1.AffineConstructor.random(interval, interval);
    var coeff = interval.getRandomElement();
    return {
        statement: multiply_1.multiply.texApply(coeff.tex, affine),
        answer: ""
    };
}
exports.getSimpleDistributivityQuestion = getSimpleDistributivityQuestion;
