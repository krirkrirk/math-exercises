"use strict";
exports.__esModule = true;
exports.exercises = void 0;
var exercises_1 = require("./exercises/exercises");
exports.exercises = exercises_1.exercises;
var powersPower_1 = require("./exercises/powers/powersPower");
// exercises.forEach((exo) => {
//   console.log(exo.instruction, exo.generator(10));
// });
console.log(powersPower_1.powersPower.generator(10));
