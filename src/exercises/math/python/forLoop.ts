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
import { VariableNode } from "#root/tree/nodes/variables/variableNode";

type Identifiers = {
  initialValue: number,
  operation: string,
  step: number,
  iterations: number,
  finalValue: number,
  opIndex: number,
};

const operations = [
  { name: "+", func: (x: number, step: number) => x + step },
  { name: "-", func: (x: number, step: number) => x - step },
  { name: "*", func: (x: number, step: number) => x * step },
  { name: "//", func: (x: number, step: number) => Math.floor(x / step) }
];

const getForLoopQuestion: QuestionGenerator<Identifiers> = () => {
  const initialValue = randint(-10, 10);
  const opIndex = randint(0, operations.length - 1);
  const op = operations[opIndex];
  const step = randint(-5, 5, [0]); 
  const iterations = randint(1, 10);
  
  let value = initialValue;
  for (let i = 0; i < iterations; i++) {
    value = op.func(value, step);
  }

  const answer = value.toString();
  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Qu'affichera le programme suivant ?
\`\`\`
x = ${initialValue}
for i in range(0, ${iterations}):
  x = x ${op.name} ${step}
print(x)
\`\`\`
`,
    keys: ['a', 'equal'],
    answerFormat: "tex",
    identifiers: { initialValue, operation: op.name, step, iterations, finalValue: value, opIndex},
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, initialValue, step, iterations, opIndex }) => {
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

  // Deux itérations en plus
  let valueTwoMore = initialValue;
  for (let i = 0; i < iterations + 1; i++) {
    valueOneMore = op.func(valueTwoMore, step);
  }
  const wrongAnswerTwoMore = valueTwoMore.toString();
  tryToAddWrongProp(propositions, wrongAnswerTwoMore);
  
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
