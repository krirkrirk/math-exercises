"use strict";
exports.__esModule = true;
exports.getRoundQuestions = exports.roundToMillieme = exports.roundToCentieme = exports.roundToDizieme = exports.roundToUnit = void 0;
var randint_1 = require("../../../mathutils/random/randint");
var decimal_1 = require("../../../numbers/decimals/decimal");
var latexParse_1 = require("../../../tree/latexParser/latexParse");
var getDistinctQuestions_1 = require("../../utils/getDistinctQuestions");
/**
 * arrondi à l'unité
 */
exports.roundToUnit = {
    id: "roundToUnit",
    connector: "\\approx",
    instruction: "Arrondir à l'unité :",
    label: "Arrondir à l'unité",
    levels: ["6", "5"],
    section: "Calculs",
    isSingleStep: true,
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(function () { return getRoundQuestions(0); }, nb); }
};
/**
 * arrondi à l'unité
 */
exports.roundToDizieme = {
    id: "roundToDizieme",
    connector: "\\approx",
    instruction: "Arrondir au dizième :",
    label: "Arrondir au dizième",
    levels: ["6", "5"],
    section: "Calculs",
    isSingleStep: true,
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(function () { return getRoundQuestions(1); }, nb); }
};
/**
 * arrondi à l'unité
 */
exports.roundToCentieme = {
    id: "roundToCentieme",
    connector: "\\approx",
    instruction: "Arrondir au centième :",
    label: "Arrondir au centième",
    levels: ["6", "5"],
    section: "Calculs",
    isSingleStep: true,
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(function () { return getRoundQuestions(2); }, nb); }
};
/**
 * arrondi à l'unité
 */
exports.roundToMillieme = {
    id: "roundToMillieme",
    connector: "\\approx",
    instruction: "Arrondir au millième :",
    label: "Arrondir au millième",
    levels: ["6", "5"],
    section: "Calculs",
    isSingleStep: true,
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(function () { return getRoundQuestions(3); }, nb); }
};
function getRoundQuestions(precisionAsked) {
    if (precisionAsked === void 0) { precisionAsked = 0; }
    var precision = (0, randint_1.randint)(precisionAsked + 1, precisionAsked + 5);
    var dec = decimal_1.DecimalConstructor.random(0, 1000, precision);
    var question = {
        statement: (0, latexParse_1.latexParse)(dec.toTree()),
        answer: (0, latexParse_1.latexParse)(dec.round(precisionAsked).toTree())
    };
    return question;
}
exports.getRoundQuestions = getRoundQuestions;
