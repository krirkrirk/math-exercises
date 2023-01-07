import { addAndSubExercise } from "./exercises/calcul/addAndSub";
import { simpleDistributivity } from "./exercises/calculLitteral/distributivity/distributivity";
import { factoType1Exercise } from "./exercises/calculLitteral/factorisation/factoType1Exercise";
import { randint } from "./mathutils/random/randint";
import { Rational } from "./numbers/rationals/rational";
import { Affine } from "./polynomials/affine";
import { LatexParser } from "./tree/latexParser/latexParser";
import { VariableNode } from "./tree/nodes/variables/variableNode";

// exercice = new Exercice(Factorisation.type, nbQuestions, opts)
//exercice = {questions: {statement, answer}, consigne, label, section, levels, connector, }
const exercice1 = factoType1Exercise;
console.log(exercice1.instruction);
console.log(exercice1.generator(10));

// const exercice2 = simpleDistributivity;
// console.log(exercice2.instruction);
// console.log(exercice2.generator(10));
// const q = new Rational(10, 5);
// console.log(q.simplify().toTex());

const aff = new Affine(4, 5);
const tree = aff.toTree();
const parser = new LatexParser();
console.log(tree);
console.log(parser.parse(tree));
