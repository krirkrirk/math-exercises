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
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";


type Identifiers = {
  initialValue: number,
  step: number,
  iterations: number,
  opIndex: number,
  a: number,
  x: number
};

const operations = [
  { name: "+", func: (x: number, step: number) => x + step},
  { name: "*", func: (x: number, step: number) => x * step},
];

const operationsreversed = [
  { name: "-", func: (x: number, step: number) => x - step},
  { name: "/", func: (x: number, step: number) => Math.floor(x / step)},
];

const getWhileLoopQuestion: QuestionGenerator<Identifiers> = () => {
  const initialValue = randint(0, 13, [0,1]);
  const opIndex = randint(0, operations.length);
  const op = operations[opIndex];
  const step = randint(1, 10, [0, 1]); 
  const iterations = randint(1, 6, [1]);

  let x = initialValue;
  const a = randint(10,30);
  while (x <= a) {
    x = op.func(x, step);
  }

  const answer = x.toString();
  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Qu'affichera le programme suivant ?
\`\`\`
a = ${a}
n = ${initialValue}
while n <= a:
  n = n ${op.name} ${step}
print(n)
\`\`\`
`,
    keys: ['a', 'equal'],
    answerFormat: "tex",
    identifiers: { initialValue, step, iterations, opIndex, a, x},
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, step, opIndex, x}) => {
  const propositions: Proposition[] = [];
  const correctAnswer = answer;
  addValidProp(propositions, correctAnswer);

  const opOneMore = operations[opIndex];
  const opOneLess = operationsreversed[opIndex]

  const w1 = opOneMore.func(x,step)
  const wrongAnswer1 = w1.toString();
  tryToAddWrongProp(propositions, wrongAnswer1);


  const w2 = opOneLess.func(x,step)
  const wrongAnswer2 = w2.toString();
  tryToAddWrongProp(propositions, wrongAnswer2);


  while (propositions.length < n) {
    
    const randomValue = randint(10,50);
   
    const randomWrongAnswer = randomValue.toString();

    tryToAddWrongProp(propositions, randomWrongAnswer);
  }
  
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, {answer})=>{
  return ans === answer
}
export const whileLoop: Exercise<Identifiers> = {
  id: 'whileLoop',
  label: "Évaluation de scripts python contenants des boucles 'while'",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Python"],
  generator: (nb: number) => getDistinctQuestions(getWhileLoopQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques"
};
