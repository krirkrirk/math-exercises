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
  x: number,
  result: number,
  opIndex1: number,
  opIndex2: number,
  opIndex3: number,
  a: number,
  b: number
};

const operations1 = [
  { symbol: "+", func: (x: number, y: number) => x + y },
  { symbol: "-", func: (x: number, y: number) => x - y }
  
];

const operations2 = [
  { symbol: "*", func: (x: number, y: number) => x * y },
  { symbol: "**", func: (x: number, y: number) => x ** y },
  { symbol: "+", func: (x: number, y: number) => x + y },
  { symbol: "-", func: (x: number, y: number) => x - y }
]

const getFunctionsQuestion: QuestionGenerator<Identifiers> = () => {
  const x = randint(0, 10, [0]);
  const a = randint(0, 10, [0]);
  const b = randint(0, 5, [0]);

  const opIndex1 = randint(0, 2);
  const opIndex2 = randint(0, 4);
  const opIndex3 = randint(0, 2);
  const operation1 = operations1[opIndex1];
  const operation2 = operations2[opIndex2];
  const operation3 = operations1[opIndex3];

  const result1 = operation1.func(x, a);
  const result2 = operation2.func(x, b);
  const result = operation3.func(result1, result2);

  const question: Question<Identifiers> = {
    answer: result.toString(),
    instruction: `Qu'affichera le programme suivant ?
\`\`\`
def f(x):
    y = x ${operation1.symbol} ${a} ${operation3.symbol} (x ${operation2.symbol} ${b})
    return y
y = f(${x})
print(y)
\`\`\`
`,
    keys: ["f","x","y","equal"],
    answerFormat: "tex",
    identifiers: { x, result, opIndex1, opIndex2, opIndex3, a, b},
  };

  return question;
};
const getPropositions: QCMGenerator<Identifiers> = (n, { answer, opIndex1, opIndex2, opIndex3, x, a, b}) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const operation1 = operations1[opIndex1];
  const operation2 = operations2[opIndex2];
  const operation3 = operations1[opIndex3];

  const result1 = operation1.func(x, a);
  const result2 = operation2.func(x, b);

  const w1 = operation3.func(result1, operation2.func(result1, b));
  const wrongAnswer1 = w1.toString();

  const w2 = operation3.func(operation1.func(result2, a), result2);
  const wrongAnswer2 = w2.toString();

  const w3 = x;
  const wrongAnswer3 = w3.toString();

  tryToAddWrongProp(propositions, wrongAnswer1);
  tryToAddWrongProp(propositions, wrongAnswer2);
  tryToAddWrongProp(propositions, wrongAnswer3);

  while (propositions.length < n) {
    const random = randint(-10,10);
    const randomWrongAnswer = random.toString();
    tryToAddWrongProp(propositions, randomWrongAnswer)
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, {answer})=>{
  return ans === answer
}
export const functions: Exercise<Identifiers> = {
  id: 'functions',
  label: "Évaluation de scripts python contenants des fonctions",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Python"],
  generator: (nb: number) => getDistinctQuestions(getFunctionsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques"
};
