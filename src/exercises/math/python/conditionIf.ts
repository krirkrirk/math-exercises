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

type Identifiers = {
  a: number;
  b: number;
  opresult: number;
  condition: string;
};

const operations = [
  { name: "+", func: (x: number, step: number) => x + step },
  { name: "-", func: (x: number, step: number) => x - step },
  { name: "*", func: (x: number, step: number) => x * step },
  { name: "//", func: (x: number, step: number) => Math.floor(x / step) },
];

const getConditionIfQuestion: QuestionGenerator<Identifiers> = () => {
  const a = randint(0, 10, [0, 1]);
  const b = randint(0, 10, [0, 1]);

  const opIndex = randint(0, operations.length);
  const operation = operations[opIndex];

  const opresult = operation.func(a, b);

  // Choisir aléatoirement entre les deux conditions
  const condition = randint(0, 2) === 0 ? "a <= b" : "b <= a";
  const answer = (condition === "a <= b" ? opresult <= b : opresult >= b)
    ? b
    : opresult;

  const question: Question<Identifiers> = {
    answer: answer.toString(),
    instruction: `Quel sera l'affichage du code suivant ?
\`\`\`
a = ${a}
b = ${b}
a = a ${operation.name} b
if ${condition} :
    a = b
print(a)
\`\`\`
`,
    keys: ["a", "b", "equal"],
    answerFormat: "tex",
    identifiers: { a, b, opresult, condition },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, a, b, opresult },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  tryToAddWrongProp(propositions, a.toString());
  tryToAddWrongProp(propositions, b.toString());
  tryToAddWrongProp(propositions, opresult.toString());

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(0, 10).toString());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const conditionIf: Exercise<Identifiers> = {
  id: "conditionIf",
  label: "Condition if 1",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Python"],
  generator: (nb: number) => getDistinctQuestions(getConditionIfQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
