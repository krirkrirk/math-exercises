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
import { IntegralNode } from "#root/tree/nodes/functions/IntegralNode";
import { CosNode } from "#root/tree/nodes/functions/cosNode";
import { SinNode } from "#root/tree/nodes/functions/sinNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";

type Identifiers = {};

const getIntegralKCosinusQuestion: QuestionGenerator<Identifiers> = () => {
  const k = randint(-10, 10, [0]);

  const cosine = new MultiplyNode(
    k.toTree(),
    new CosNode(new VariableNode("x")),
  );

  let lowerBound = randint(-3, 4);
  let upperBound = randint(-3, 4);

  const integral = new IntegralNode(
    cosine,
    lowerBound.toTree(),
    upperBound.toTree(),
    "x",
  );

  const answer = k * Math.sin(upperBound) - k * Math.sin(lowerBound);

  const question: Question<Identifiers> = {
    answer: answer.toTree().toTex(),
    instruction: `Calculez la valeur de l'intégrale suivante : $${integral.toTex()}$`,
    keys: [],
    answerFormat: "tex",
    identifiers: {},
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    throw Error("QCM not implemented");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  throw Error("VEA not implemented");
};
export const integralKCosinus: Exercise<Identifiers> = {
  id: "integralKCosinus",
  label: "Calcul de l'intégral de fonctions kcos(x)",
  levels: ["TermSpé"],
  isSingleStep: true,
  sections: ["Intégration"],
  generator: (nb: number) =>
    getDistinctQuestions(getIntegralKCosinusQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
