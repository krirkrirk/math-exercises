"use strict";
exports.__esModule = true;
var factoType1Exercise_1 = require("./exercises/calculLitteral/factorisation/factoType1Exercise");
var affine_1 = require("./polynomials/affine");
var latexParser_1 = require("./tree/latexParser/latexParser");
// exercice = new Exercice(Factorisation.type, nbQuestions, opts)
//exercice = {questions: {statement, answer}, consigne, label, section, levels, connector, }
var exercice1 = factoType1Exercise_1.factoType1Exercise;
console.log(exercice1.instruction);
console.log(exercice1.generator(10));
// const exercice2 = simpleDistributivity;
// console.log(exercice2.instruction);
// console.log(exercice2.generator(10));
// const q = new Rational(10, 5);
// console.log(q.simplify().toTex());
var aff = new affine_1.Affine(4, 5);
var tree = aff.toTree();
var parser = new latexParser_1.LatexParser();
console.log(tree);
console.log(parser.parse(tree));
