import { FactoType1Exercise } from "./exercises/calculLitteral/factorisation/factoType1Exercise";

// exercice = new Exercice(Factorisation.type, nbQuestions, opts)
//exercice = {questions: {statement, answer}, consigne, label, section, levels, connector, }
const exercice = new FactoType1Exercise(10);
console.log(exercice.instruction);
console.log(exercice.questions);
