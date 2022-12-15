import { addAndSubExercise } from "./exercises/calcul/addAndSub";
import { factoType1Exercise } from "./exercises/calculLitteral/factorisation/factoType1Exercise";
import { randint } from "./mathutils/random/randint";
import { Rational } from "./numbers/rationals/rational";

// exercice = new Exercice(Factorisation.type, nbQuestions, opts)
//exercice = {questions: {statement, answer}, consigne, label, section, levels, connector, }
const exercice1 = factoType1Exercise;
console.log(exercice1.instruction);
console.log(exercice1.generator(10));

const exercice2 = addAndSubExercise;
console.log(exercice2.instruction);
console.log(exercice2.generator(10));

const q = new Rational(10, 5);
console.log(q.simplify().toTex());
