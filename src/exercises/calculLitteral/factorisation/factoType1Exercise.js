"use strict";
exports.__esModule = true;
exports.getFactoType1Question = exports.FactoType1Exercise = void 0;
var add_1 = require("../../../operations/add");
var substract_1 = require("../../../operations/substract");
var affine_1 = require("../../../polynomials/affine");
var random_1 = require("../../../utils/random");
var shuffle_1 = require("../../../utils/shuffle");
var getDistinctQuestions_1 = require("../../utils/getDistinctQuestions");
/**
 *
 * @returns type (ax+b)(cx+d) +- (ax+b)(ex+f)
 */
var FactoType1Exercise = /** @class */ (function () {
    function FactoType1Exercise(nbOfQuestions) {
        this.connector = "=";
        this.instruction = "Factoriser :";
        this.label = "Factorisation du type $(ax+b)(cx+d) \\pm (ax+b)(ex+f)$";
        this.levels = ["3", "2"];
        this.section = "Calcul Littéral";
        this.questions = (0, getDistinctQuestions_1.getDistinctQuestions)(exports.getFactoType1Question, nbOfQuestions);
    }
    return FactoType1Exercise;
}());
exports.FactoType1Exercise = FactoType1Exercise;
var getFactoType1Question = function () {
    var affines = affine_1.AffineConstructor.differentRandoms(3);
    var permut = [
        [affines[0], affines[1]],
        [affines[0], affines[2]],
    ];
    (0, shuffle_1.shuffle)(permut[0]);
    (0, shuffle_1.shuffle)(permut[1]);
    var operation = (0, random_1.random)([add_1.add, substract_1.substract]);
    var statement = "(".concat(permut[0][0], ")(").concat(permut[0][1], ") ").concat(operation.tex, " (").concat(permut[1][0], ")(").concat(permut[1][1], ")");
    var answer = "(".concat(affines[0], ")(").concat(operation.apply(affines[1], affines[2]), ")");
    return { statement: statement, answer: answer };
};
exports.getFactoType1Question = getFactoType1Question;
