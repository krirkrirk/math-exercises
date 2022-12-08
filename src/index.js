"use strict";
exports.__esModule = true;
var factoType1Exercise_1 = require("./exercises/calculLitteral/factorisation/factoType1Exercise");
// exercice = new Exercice(Factorisation.type, nbQuestions, opts)
//exercice = {questions: {statement, answer}, consigne, label, section, levels, connector, }
var exercice = new factoType1Exercise_1.FactoType1Exercise(10);
console.log(exercice.instruction);
console.log(exercice.questions);
