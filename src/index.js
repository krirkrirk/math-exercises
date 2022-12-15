"use strict";
exports.__esModule = true;
var addAndSub_1 = require("./exercises/calcul/addAndSub");
var factoType1Exercise_1 = require("./exercises/calculLitteral/factorisation/factoType1Exercise");
var rational_1 = require("./numbers/rationals/rational");
// exercice = new Exercice(Factorisation.type, nbQuestions, opts)
//exercice = {questions: {statement, answer}, consigne, label, section, levels, connector, }
var exercice1 = factoType1Exercise_1.factoType1Exercise;
console.log(exercice1.instruction);
console.log(exercice1.generator(10));
var exercice2 = addAndSub_1.addAndSubExercise;
console.log(exercice2.instruction);
console.log(exercice2.generator(10));
var q = new rational_1.Rational(10, 5);
console.log(q.simplify().toTex());
