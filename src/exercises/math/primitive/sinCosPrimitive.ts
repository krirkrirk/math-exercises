import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";

import { randint } from "#root/math/utils/random/randint";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { CosNode } from "#root/tree/nodes/functions/cosNode";
import { SinNode } from "#root/tree/nodes/functions/sinNode";
import { Node } from "#root/tree/nodes/node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { coinFlip } from "#root/utils/coinFlip";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  a: number;
  isCos: boolean;
};

export const getSinCosPrimitive: QuestionGenerator<Identifiers> = () => {
  const a = randint(-9, 10, [0]);

  let selectedFunction: AlgebraicNode;
  let integratedFuction: AlgebraicNode;

  const isCos = coinFlip();
  selectedFunction = isCos
    ? new MultiplyNode(new NumberNode(a), new CosNode(new VariableNode("x")))
    : new MultiplyNode(new NumberNode(a), new SinNode(new VariableNode("x")));

  integratedFuction = isCos
    ? new MultiplyNode(new NumberNode(a), new SinNode(new VariableNode("x")))
    : new MultiplyNode(new NumberNode(-a), new CosNode(new VariableNode("x")));

  const answer = new AddNode(integratedFuction, new VariableNode("C")).toTex();

  const question: Question<Identifiers> = {
    instruction: `Déterminer la forme générale des primitives de la fonction $f$ définie par $f(x) = ${selectedFunction.toTex()}$.`,
    startStatement: `F(x)`,
    answer,
    keys: ["x", "C", "sin", "cos"],
    answerFormat: "tex",
    identifiers: { a, isCos },
  };

  return question;
};

export const getSinCosPrimitivePropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, a },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const wrongIntegrals = [
    new MultiplyNode(new NumberNode(a), new SinNode(new VariableNode("x"))),
    new MultiplyNode(new NumberNode(-a), new CosNode(new VariableNode("x"))),
    new MultiplyNode(new NumberNode(a), new CosNode(new VariableNode("x"))),
    new MultiplyNode(new NumberNode(-a), new SinNode(new VariableNode("x"))),
    new MultiplyNode(
      new NumberNode(randint(-9, 10, [a, 0])),
      new CosNode(new VariableNode("x")),
    ),
    new MultiplyNode(
      new NumberNode(randint(-9, 10, [a, 0])),
      new SinNode(new VariableNode("x")),
    ),
  ];
  const cNode = new VariableNode("C");
  while (propositions.length < n) {
    let wrongIntegral = wrongIntegrals[randint(0, wrongIntegrals.length)];
    tryToAddWrongProp(propositions, new AddNode(wrongIntegral, cNode).toTex());
  }

  return shuffle(propositions);
};
export const isSinCosPrimitiveAnswerValid: VEA<Identifiers> = (
  ans,
  { isCos, a },
) => {
  const integratedFuction = isCos
    ? new MultiplyNode(new NumberNode(a), new SinNode(new VariableNode("x")))
    : new MultiplyNode(new NumberNode(-a), new CosNode(new VariableNode("x")));

  const answer = new AddNode(integratedFuction, new VariableNode("C"));
  const texs = answer.toAllValidTexs();
  console.log(texs);
  return texs.includes(ans);
};

export const sinCosPrimitive: Exercise<Identifiers> = {
  id: "sinCosPrimitive",
  connector: "=",
  label: "Primitive de sin et cos",
  levels: ["TermSpé", "MathComp"],
  sections: ["Primitives", "Trigonométrie"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getSinCosPrimitive, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions: getSinCosPrimitivePropositions,
  isAnswerValid: isSinCosPrimitiveAnswerValid,
  subject: "Mathématiques",
};
