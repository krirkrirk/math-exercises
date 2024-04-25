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
  a: number
};

const operations = [
  { name: "+", func: (x: number, step: number) => x + step},
  { name: "*", func: (x: number, step: number) => x * step},
];

const getWhileLoopQuestion: QuestionGenerator<Identifiers> = () => {
  const initialValue = randint(0, 10, [0,1]);
  const opIndex = randint(0, operations.length);
  const op = operations[opIndex];
  const step = randint(1, 10, [0, 1]); 
  const iterations = randint(1, 6, [1]);

  let n = initialValue;
  const a = randint(10,30);
  while (n <= a) {
    n = op.func(n, step);
  }

  const answer = n.toString();
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
    identifiers: { initialValue, step, iterations, opIndex, a},
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, initialValue, step, iterations, opIndex, a}) => {
  const propositions: Proposition[] = [];
  const correctAnswer = answer;
  addValidProp(propositions, correctAnswer);

  const op = operations[opIndex];

  let w1 = initialValue
  while (w1 < op.func(a,w1)) {
    w1 = op.func(w1, step);
  }
  const wrongAnswer1 = w1.toString();
  tryToAddWrongProp(propositions, wrongAnswer1);


  let w2 = initialValue
  while (w2 <= a-w2) {
    w2 = op.func(w2, step);
  }
  const wrongAnswer2 = w2.toString();
  tryToAddWrongProp(propositions, wrongAnswer2);

  const valueNegative = -parseInt(answer);
  const wrongAnswerNegative = valueNegative.toString();
  tryToAddWrongProp(propositions, wrongAnswerNegative);

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
