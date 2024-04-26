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
} from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from "#root/math/utils/random/randint";

type Identifiers = {
  a: number,
  b: number,
  d: number,
};

const operations = [
  { name: "+", func: (x: number, step: number) => x + step},
  { name: "-", func: (x: number, step: number) => x - step},
  { name: "*", func: (x: number, step: number) => x * step},
  { name: "//", func: (x: number, step: number) => Math.floor(x / step) }
];


const getConditionIfQuestion: QuestionGenerator<Identifiers> = () => {
  const a = randint(0, 10,[0,1]);
  const b = randint(0, 10,[0,1]);
  
  const opIndex = randint(0, operations.length);
  const operation = operations[opIndex];

  const d = operation.func(a,b);
  let c = d;
  
  if(d<=b){c = b};

  const answer = c;

  const question: Question<Identifiers> = {
    answer: answer.toString(),
    instruction: `Quel sera l'affichage du code suivant ?
\`\`\`
a = ${a}
b = ${b}
a = a ${operation.name} b
if a<=b :
    a = b
print(a)
\`\`\`
`,
    keys: ["a", "b", "equal"],
    answerFormat: "tex",
    identifiers: { a, b, d},
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a, b, d }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const w1 = b;
  const w2 = a;
  const w3 = d;

  tryToAddWrongProp(propositions, w1.toString())
  tryToAddWrongProp(propositions, w2.toString())
  tryToAddWrongProp(propositions, w3.toString())

  while (propositions.length < n) {
    const random = randint(0, 10);
    const randomWrongAnswer = random.toString();
    tryToAddWrongProp(propositions, randomWrongAnswer)
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const conditionIf: Exercise<Identifiers> = {
  id: 'conditionIf',
  label: "Évaluation de scripts python contenants des conditions 'if'",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Python"],
  generator: (nb: number) => getDistinctQuestions(getConditionIfQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques"
};