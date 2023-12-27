import {
  MathExercise,
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
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { SquareNode } from "#root/tree/nodes/operators/powerNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { shuffle } from "#root/utils/shuffle";
import { v4 } from "uuid";
type Identifiers = {
  a: number;
};

const getInverseFunctionDerivative: QuestionGenerator<Identifiers> = () => {
  const a = randint(-19, 20, [0]);
  const answer = `${a > 0 ? "-" : ""}\\frac{${Math.abs(a)}}{x^2}`;
  const question: Question<Identifiers> = {
    instruction: `Déterminer la fonction dérivée $f'$ de la fonction $f$ définie par $f(x) =\\frac{${a}}{x}$.`,
    startStatement: `f'(x)`,
    answer,
    keys: ["x"],
    answerFormat: "tex",
    identifiers: { a },
  };

  return question;
};
const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  tryToAddWrongProp(propositions, `\\frac{${a}}{x^2}`);
  tryToAddWrongProp(propositions, `\\frac{${a}}{x}`);
  tryToAddWrongProp(propositions, `${a}`);
  tryToAddWrongProp(propositions, `\\frac{${2 * a}}{x}`);

  while (propositions.length < n) {
    const wrongAnswer = `\\frac{${randint(-9, 10, [0, -a])}}{x^2}`;
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a }) => {
  const answerTree = new FractionNode(
    new NumberNode(-a),
    new SquareNode(new VariableNode("x")),
  );
  const texs = answerTree.toAllValidTexs();
  console.log(texs);
  return texs.includes(ans);
};

export const inverseFunctionDerivative: MathExercise<Identifiers> = {
  id: "inverseFunctionDerivative",
  connector: "=",
  label: "Dérivée d'une fonction inverse",
  levels: ["1reESM", "1reSpé", "1reTech", "MathComp", "TermTech"],
  sections: ["Dérivation", "Fonction inverse"],
  isSingleStep: false,
  generator: (nb: number) =>
    getDistinctQuestions(getInverseFunctionDerivative, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
