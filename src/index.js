"use strict";
exports.__esModule = true;
var factorisation_1 = require("./exercises/calculLitteral/factorisation/factorisation");
// exercice = new Exercice(Factorisation.type, nbQuestions, opts)
//exercice = {questions: {statement, answer}, consigne, label, section, levels, connector, }
var exercice = new factorisation_1.FactoType1Exercise(10);
console.log(exercice.instruction);
console.log(exercice.questions);
