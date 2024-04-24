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
  a: number,
  b: number,
  id1: number,
  id2: number
};

const operations = [
  { name: "+", func: (a: number, b: number) => a + b },
  { name: "-", func: (a: number, b: number) => a - b },
  { name: "*", func: (a: number, b: number) => a * b },
  { name: "//", func: (a: number, b: number) => Math.floor(a / b) }
];

const getInOutCalculQuestion: QuestionGenerator<Identifiers> = () => {
  const a = randint(-10, 10);
  const b = randint(-10, 10);
  
  const id1 = randint(0, operations.length)
  const id2 = randint(0, operations.length)
  const op1 = operations[id1];
  const op2 = operations[id2];
  const c = op1.func(a, b);
  const d = op2.func(a, c);

  const answer = d.toString();
  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Qu'affichera le programme suivant ?
\`\`\`
a = ${a}
b = ${b}
b = a ${op1.name} b 
a = a ${op2.name} b
print(a)     
\`\`\`
`
,
    keys: ['a','b','equal'],
    answerFormat: "tex",
    identifiers: { a, b, id1, id2 },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a, b, id1, id2 }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  

  const op1 = operations[id1];
  const op2 = operations[id2];
  
  const w1 = op1.func(a, b)
  const w2 = op2.func(a, b);
  const w3 = a;

  const wrongAnswer1 = w1.toString();
  const wrongAnswer2 = w2.toString();
  const wrongAnswer3 = w3.toString();

  tryToAddWrongProp(propositions, wrongAnswer1);
  tryToAddWrongProp(propositions, wrongAnswer2);
  tryToAddWrongProp(propositions, wrongAnswer3);

  while (propositions.length < n) {
    const random = randint(-10,10);
    const randomwrongAnswer = random.toString();
    tryToAddWrongProp(propositions, randomwrongAnswer)
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer}) => {
  return ans === answer
};
export const inOutCalcul: Exercise<Identifiers> = {
  id: "inOutCalcul",
  label: "Évaluation de scripts python d'opérations arithmétiques",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Python"],
  generator: (nb: number) => getDistinctQuestions(getInOutCalculQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
