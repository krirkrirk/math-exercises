"use strict";
exports.__esModule = true;
exports.getRoundQuestions = exports.allRoundings = exports.roundToMillieme = exports.roundToCentieme = exports.roundToDixieme = exports.roundToUnit = void 0;
var randint_1 = require("../../../mathutils/random/randint");
var decimal_1 = require("../../../numbers/decimals/decimal");
var latexParser_1 = require("../../../tree/parsers/latexParser");
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
exports.roundToDixieme = {
    id: "roundToDixieme",
    connector: "\\approx",
    instruction: "Arrondir au dixième :",
    label: "Arrondir au dixième",
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
exports.allRoundings = {
    id: "allRoundings",
    connector: "\\approx",
    instruction: "",
    label: "Arrondir un nombre décimal",
    levels: ["6", "5"],
    section: "Calculs",
    isSingleStep: true,
    generator: function (nb) { return (0, getDistinctQuestions_1.getDistinctQuestions)(function () { return getRoundQuestions((0, randint_1.randint)(0, 4)); }, nb); }
};
var instructions = [
    "Arrondir à l'unité :",
    "Arrondir au dixième :",
    "Arrondir au centième :",
    "Arrondir au millième :",
];
function getRoundQuestions(precisionAsked) {
    if (precisionAsked === void 0) { precisionAsked = 0; }
    var precision = (0, randint_1.randint)(precisionAsked + 1, precisionAsked + 5);
    var dec = decimal_1.DecimalConstructor.random(0, 1000, precision);
    var question = {
        instruction: instructions[precisionAsked],
        startStatement: (0, latexParser_1.latexParser)(dec.toTree()),
        answer: (0, latexParser_1.latexParser)(dec.round(precisionAsked).toTree())
    };
    return question;
}
exports.getRoundQuestions = getRoundQuestions;
