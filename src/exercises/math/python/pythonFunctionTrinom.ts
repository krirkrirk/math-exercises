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
import { SquareRoot } from "#root/math/numbers/reals/real";
import { TrinomConstructor } from "#root/math/polynomials/trinom";
import { randint } from "#root/math/utils/random/randint";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { SqrtNode } from "#root/tree/nodes/functions/sqrtNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";

type Identifiers = {
  x: number;
  trinom: number[];
  image: number;
};

const getPythonFunctionTrinomQuestion: QuestionGenerator<Identifiers> = () => {
  const trinom = TrinomConstructor.random();
  const x = randint(-5, 5);
  const image = trinom.calculate(x);
  const equation = trinom.toPython();

  const question: Question<Identifiers> = {
    answer: image.toString(),
    instruction: `Qu'affichera le programme suivant ?
\`\`\`
def f(x):
    y = ${equation}
    return y
y = f(${x})
print(y)
\`\`\`
`,
    keys: ["f", "x", "y", "equal"],
    answerFormat: "tex",
    identifiers: { x, trinom: [trinom.a, trinom.b, trinom.c], image },
  };

  return question;
};
const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, trinom, image, x },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const w1 = trinom[0] * x * 2 + trinom[1] * x + trinom[2];
  const w2 = trinom[0] * x + trinom[1] * x + trinom[2];
  const w3 = new EqualNode(new VariableNode("y"), image.toTree());

  tryToAddWrongProp(propositions, w1.toString());
  tryToAddWrongProp(propositions, w2.toString());
  tryToAddWrongProp(propositions, w3.toTex());

  while (propositions.length < n) {
    const random = randint(-10, 10);
    const randomWrongAnswer = random.toString();
    tryToAddWrongProp(propositions, randomWrongAnswer);
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const pythonFunctionTrinom: Exercise<Identifiers> = {
  id: "pythonFunctionTrinom",
  label: "Valeur de retour d'une fonction",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Python"],
  generator: (nb: number) =>
    getDistinctQuestions(getPythonFunctionTrinomQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
