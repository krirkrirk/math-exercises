"use strict";
exports.__esModule = true;
exports.getAllIdentitiesQuestion = exports.allIdentities = void 0;
var random_1 = require("../../../utils/random");
var getDistinctQuestions_1 = require("../../utils/getDistinctQuestions");
var firstIdentity_1 = require("./firstIdentity");
var secondIdentity_1 = require("./secondIdentity");
var thirdIdentity_1 = require("./thirdIdentity");
exports.allIdentities = {
    connector: "=",
    instruction: "Développer et réduire :",
    label: "Identités remarquables (toutes)",
    levels: ["3", "2"],
    section: "Calcul Littéral",
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(getAllIdentitiesQuestion, nb); }
};
function getAllIdentitiesQuestion() {
    var rand = (0, random_1.random)([1, 2, 3]);
    return rand === 1
        ? (0, firstIdentity_1.getFirstIdentityQuestion)()
        : rand === 2
            ? (0, secondIdentity_1.getSecondIdentityQuestion)()
            : (0, thirdIdentity_1.getThirdIdentityQuestion)();
}
exports.getAllIdentitiesQuestion = getAllIdentitiesQuestion;
