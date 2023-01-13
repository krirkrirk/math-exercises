"use strict";
exports.__esModule = true;
exports.getFactoType1Question = exports.factoType1Exercise = void 0;
var affine_1 = require("../../../polynomials/affine");
var latexParser_1 = require("../../../tree/parsers/latexParser");
var addNode_1 = require("../../../tree/nodes/operators/addNode");
var multiplyNode_1 = require("../../../tree/nodes/operators/multiplyNode");
var substractNode_1 = require("../../../tree/nodes/operators/substractNode");
var random_1 = require("../../../utils/random");
var shuffle_1 = require("../../../utils/shuffle");
var getDistinctQuestions_1 = require("../../utils/getDistinctQuestions");
/**
 *  type (ax+b)(cx+d) ± (ax+b)(ex+f)
 */
exports.factoType1Exercise = {
    id: "facto1",
    connector: "=",
    instruction: "Factoriser :",
    isSingleStep: false,
    label: "Factorisation du type $(ax+b)(cx+d) \\pm (ax+b)(ex+f)$",
    levels: ["3", "2"],
    section: "Calcul littéral",
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(getFactoType1Question, nb); }
};
function getFactoType1Question() {
    var affines = affine_1.AffineConstructor.differentRandoms(3);
    var permut = [(0, shuffle_1.shuffle)([affines[0], affines[1]]), (0, shuffle_1.shuffle)([affines[0], affines[2]])];
    var operation = (0, random_1.random)(["add", "substract"]);
    var statementTree = operation === "add"
        ? new addNode_1.AddNode(new multiplyNode_1.MultiplyNode(permut[0][0].toTree(), permut[0][1].toTree()), new multiplyNode_1.MultiplyNode(permut[1][0].toTree(), permut[1][1].toTree()))
        : new substractNode_1.SubstractNode(new multiplyNode_1.MultiplyNode(permut[0][0].toTree(), permut[0][1].toTree()), new multiplyNode_1.MultiplyNode(permut[1][0].toTree(), permut[1][1].toTree()));
    var answerTree = new multiplyNode_1.MultiplyNode(affines[0].toTree(), affines[1].add(operation === "add" ? affines[2] : affines[2].opposite()).toTree());
    var question = {
        statement: (0, latexParser_1.latexParser)(statementTree),
        answer: (0, latexParser_1.latexParser)(answerTree)
    };
    return question;
}
exports.getFactoType1Question = getFactoType1Question;
