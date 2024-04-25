import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";

type Identifiers = {
  initialValue: number,
  step: number,
  iterations: number,
  opIndex: number,
};

const operations = [
  { name: "+", func: (x: number, step: number) => x + step, tree: (step: number) => new AddNode(new VariableNode('x'), step.toTree()).simplify()},
  { name: "-", func: (x: number, step: number) => x - step, tree: (step: number) => new SubstractNode(new VariableNode('x'), step.toTree()).simplify() },
  { name: "*", func: (x: number, step: number) => x * step, tree: (step: number) => new MultiplyNode(new VariableNode('x'), step.toTree())},
  // { name: "//", func: (x: number, step: number) => Math.floor(x / step) }
];

const getForLoopQuestion: QuestionGenerator<Identifiers> = () => {
  const initialValue = randint(-10, 10, [0,1]);
  const opIndex = randint(0, operations.length);
  const op = operations[opIndex];
  const step = randint(-10, 10, [0, 1]); 
  const iterations = randint(1, 6);
  
  let value = initialValue;
  for (let i = 0; i < iterations; i++) {
    value = op.func(value, step);
  }

  const answer = value.toString();
  const equation = op.tree(step);
  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Qu'affichera le programme suivant ?
\`\`\`
x = ${initialValue}
for i in range(0, ${iterations}):
  x = ${equation.toTex()}
print(x)
\`\`\`
`,
    keys: ['a', 'equal'],
    answerFormat: "tex",
    identifiers: { initialValue, step, iterations, opIndex},
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, initialValue, step, iterations, opIndex}) => {
  const propositions: Proposition[] = [];
  const correctAnswer = answer;
  addValidProp(propositions, correctAnswer);

  const op = operations[opIndex];

  // Une itération en moins
  let valueOneLess = initialValue;
  for (let i = 0; i < iterations - 1; i++) {
    valueOneLess = op.func(valueOneLess, step);
  }
  const wrongAnswerOneLess = valueOneLess.toString();
  tryToAddWrongProp(propositions, wrongAnswerOneLess);

  // Une itération en plus
  let valueOneMore = initialValue;
  for (let i = 0; i < iterations + 1; i++) {
    valueOneMore = op.func(valueOneMore, step);
  }
  const wrongAnswerOneMore = valueOneMore.toString();
  tryToAddWrongProp(propositions, wrongAnswerOneMore);

  // Erreur sur le négatif
  const valueNegative = parseInt(answer) * (-1);
  const wrongAnswerNegative = valueNegative.toString();
  tryToAddWrongProp(propositions, wrongAnswerNegative);

  // Troisième proposition aléatoire
  while (propositions.length < n) {
    let randomValue = initialValue;
    const randomIterations = randint(1, 10); 
    for (let i = 0; i < randomIterations; i++) {
      randomValue = op.func(randomValue, step);
    }
    const randomWrongAnswer = randomValue.toString();
    tryToAddWrongProp(propositions, randomWrongAnswer);
  }
  
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer}) => {
  return ans === answer
};
export const forLoop: Exercise<Identifiers> = {
  id: "forLoop",
  label: "Évaluation de scripts python contenants des boucles 'for'",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Python"],
  generator: (nb: number) => getDistinctQuestions(getForLoopQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
