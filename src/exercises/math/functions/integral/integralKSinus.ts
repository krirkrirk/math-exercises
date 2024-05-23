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
import { remarkableTrigoValues } from "#root/math/trigonometry/remarkableValues";
import { randint } from "#root/math/utils/random/randint";
import { IntegralNode } from "#root/tree/nodes/functions/integralNode";
import { CosNode } from "#root/tree/nodes/functions/cosNode";
import { SinNode } from "#root/tree/nodes/functions/sinNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { PiNode } from "#root/tree/nodes/numbers/piNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";

type Identifiers = {
  lowerBoundIndex: number;
  upperBoundIndex: number;
  k: number;
};

const selectedIndices = [0, 1, 2, 3, 4, 8];
const trigValues = selectedIndices.map(
  (index) => remarkableTrigoValues[index].angle,
);

const getIntegralKSinusQuestion: QuestionGenerator<Identifiers> = () => {
  const k = randint(-10, 10, [0]);

  const sine = new MultiplyNode(k.toTree(), new SinNode(new VariableNode("x")));

  let lowerBoundIndex = randint(0, trigValues.length);
  let upperBoundIndex = randint(0, trigValues.length);

  while (
    trigValues[lowerBoundIndex].evaluate({}) >=
    trigValues[upperBoundIndex].evaluate({})
  ) {
    lowerBoundIndex = randint(0, trigValues.length);
    upperBoundIndex = randint(0, trigValues.length);
  }

  const lowerBound = trigValues[lowerBoundIndex];
  const upperBound = trigValues[upperBoundIndex];

  const integral = new IntegralNode(sine, lowerBound, upperBound, "x");

  const cosa = new CosNode(lowerBound);
  const cosb = new CosNode(upperBound);

  const answer = new SubstractNode(
    new MultiplyNode(k.toTree(), cosa),
    new MultiplyNode(k.toTree(), cosb),
  ).simplify();

  const question: Question<Identifiers> = {
    answer: answer.toTex(),
    instruction: `Calculez la valeur de l'intégrale suivante : $${integral.toTex()}$`,
    keys: [],
    answerFormat: "tex",
    identifiers: { lowerBoundIndex, upperBoundIndex, k },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, lowerBoundIndex, upperBoundIndex, k },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const lowerBound = trigValues[lowerBoundIndex];
  const upperBound = trigValues[upperBoundIndex];

  const sina = new SinNode(lowerBound);
  const sinb = new SinNode(upperBound);

  const wrongAnswer1 = new SubstractNode(
    new MultiplyNode(k.toTree(), sinb),
    new MultiplyNode(k.toTree(), sina),
  ).simplify();

  const cosa = new CosNode(lowerBound);
  const cosb = new CosNode(upperBound);

  const wrongAnswer2 = new SubstractNode(
    new MultiplyNode(k.toTree(), cosb),
    new MultiplyNode(k.toTree(), cosa),
  ).simplify();

  const wrongAnswer3 = new AddNode(
    new MultiplyNode(k.toTree(), cosa),
    new MultiplyNode(k.toTree(), cosb),
  ).simplify();

  tryToAddWrongProp(propositions, wrongAnswer1.toTex());
  tryToAddWrongProp(propositions, wrongAnswer2.toTex());
  tryToAddWrongProp(propositions, wrongAnswer3.toTex());

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(-10, 10).toTree().toTex());
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, lowerBoundIndex, upperBoundIndex, k },
) => {
  const lowerBound = trigValues[lowerBoundIndex];
  const upperBound = trigValues[upperBoundIndex];

  const cosa = new CosNode(lowerBound);
  const cosb = new CosNode(upperBound);

  const validanswer = new SubstractNode(
    new MultiplyNode(k.toTree(), cosa),
    new MultiplyNode(k.toTree(), cosb),
  ).simplify();

  const latexs = validanswer.toAllValidTexs({ allowSimplifySqrt: true });
  return latexs.includes(ans);
};
export const integralKSinus: Exercise<Identifiers> = {
  id: "integralKSinus",
  label: "Calcul de l'intégral de fonctions ksin(x)",
  levels: ["TermSpé"],
  isSingleStep: true,
  sections: ["Intégration"],
  generator: (nb: number) =>
    getDistinctQuestions(getIntegralKSinusQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
