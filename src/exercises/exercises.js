"use strict";
exports.__esModule = true;
exports.exercises = void 0;
var addAndSub_1 = require("./calcul/addAndSub");
var fractionAndIntegerDivision_1 = require("./calcul/fractions/fractionAndIntegerDivision");
var fractionAndIntegerProduct_1 = require("./calcul/fractions/fractionAndIntegerProduct");
var fractionAndIntegerSum_1 = require("./calcul/fractions/fractionAndIntegerSum");
var fractionsDivision_1 = require("./calcul/fractions/fractionsDivision");
var fractionsProduct_1 = require("./calcul/fractions/fractionsProduct");
var fractionsSum_1 = require("./calcul/fractions/fractionsSum");
var simplifyFraction_1 = require("./calcul/fractions/simplifyFraction");
var operationsPriorities_1 = require("./calcul/operationsPriorities");
var allIdentities_1 = require("./calculLitteral/distributivity/allIdentities");
var doubleDistributivity_1 = require("./calculLitteral/distributivity/doubleDistributivity");
var firstIdentity_1 = require("./calculLitteral/distributivity/firstIdentity");
var secondIdentity_1 = require("./calculLitteral/distributivity/secondIdentity");
var simpleDistributivity_1 = require("./calculLitteral/distributivity/simpleDistributivity");
var thirdIdentity_1 = require("./calculLitteral/distributivity/thirdIdentity");
var equationType1Exercise_1 = require("./calculLitteral/equation/equationType1Exercise");
var equationType2Exercise_1 = require("./calculLitteral/equation/equationType2Exercise");
var equationType3Exercise_1 = require("./calculLitteral/equation/equationType3Exercise");
var equationType4Exercise_1 = require("./calculLitteral/equation/equationType4Exercise");
var factoType1Exercise_1 = require("./calculLitteral/factorisation/factoType1Exercise");
var simpifySquareRoot_1 = require("./squareRoots/simpifySquareRoot");
exports.exercises = [
    /**
     * calcul litteral
     */
    factoType1Exercise_1.factoType1Exercise,
    simpleDistributivity_1.simpleDistributivity,
    doubleDistributivity_1.doubleDistributivity,
    firstIdentity_1.firstIdentity,
    secondIdentity_1.secondIdentity,
    thirdIdentity_1.thirdIdentity,
    allIdentities_1.allIdentities,
    equationType1Exercise_1.equationType1Exercise,
    equationType2Exercise_1.equationType2Exercise,
    equationType3Exercise_1.equationType3Exercise,
    equationType4Exercise_1.equationType4Exercise,
    /**
     * square roots
     */
    simpifySquareRoot_1.simplifySquareRoot,
    /**
     * fractions
     */
    fractionAndIntegerDivision_1.fractionAndIntegerDivision,
    fractionAndIntegerProduct_1.fractionAndIntegerProduct,
    fractionAndIntegerSum_1.fractionAndIntegerSum,
    fractionsDivision_1.fractionsDivision,
    fractionsProduct_1.fractionsProduct,
    fractionsSum_1.fractionsSum,
    simplifyFraction_1.simplifyFraction,
    /**
     * calcul
     */
    operationsPriorities_1.operationsPriorities,
    addAndSub_1.addAndSubExercise,
];
