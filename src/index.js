"use strict";
exports.__esModule = true;
exports.exercises = void 0;
var exercises_1 = require("./exercises/exercises");
exports.exercises = exercises_1.exercises;
var latexParser_1 = require("./tree/parsers/latexParser");
var polynomial_1 = require("./polynomials/polynomial");
var derivateParser_1 = require("./tree/parsers/derivateParser");
// exercises.forEach((exo) => {
//   console.log(exo.instruction, exo.generator(10));
// });
var pol = new polynomial_1.Polynomial([2, 3, 1, 4]);
console.log((0, latexParser_1.latexParser)((0, derivateParser_1.derivateParser)(pol.toTree())));
