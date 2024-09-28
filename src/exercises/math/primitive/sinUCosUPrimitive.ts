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
import {
  Polynomial,
  PolynomialConstructor,
} from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { CosNode } from "#root/tree/nodes/functions/cosNode";
import { OppositeNode } from "#root/tree/nodes/functions/oppositeNode";
import { SinNode } from "#root/tree/nodes/functions/sinNode";
import { Node } from "#root/tree/nodes/node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { coinFlip } from "#root/utils/coinFlip";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  coeffs: number[];
  isCos: boolean;
};

export const getSinUCosUPrimitive: QuestionGenerator<Identifiers> = () => {
  const u = PolynomialConstructor.randomWithOrder(randint(1, 3));

  let selectedFunction: AlgebraicNode;
  let integratedFuction: AlgebraicNode;
  const isCos = coinFlip();
  selectedFunction = isCos
    ? new MultiplyNode(u.derivate().toTree(), new CosNode(u.toTree()))
    : new MultiplyNode(u.derivate().toTree(), new SinNode(u.toTree()));

  integratedFuction = isCos
    ? new SinNode(u.toTree())
    : new MultiplyNode(new NumberNode(-1), new CosNode(u.toTree()));

  const answer = new AddNode(integratedFuction, new VariableNode("C")).toTex();

  const question: Question<Identifiers> = {
    instruction: `Déterminer la forme générale des primitives de la fonction $f$ définie par $f(x) = ${selectedFunction.toTex()}$.`,
    startStatement: `F(x)`,
    answer,
    keys: ["x", "C", "sin", "cos"],
    answerFormat: "tex",
    identifiers: { coeffs: u.coefficients, isCos },
  };

  return question;
};

export const getSinUCosUPrimitivePropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, coeffs },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const u = new Polynomial(coeffs);
  const wrongIntegrals = [
    new MultiplyNode(u.toTree(), new CosNode(u.toTree())),
    new MultiplyNode(u.toTree(), new SinNode(u.toTree())),
    new SinNode(u.toTree()),
    new CosNode(u.toTree()),
    new MultiplyNode(new NumberNode(-1), new CosNode(u.toTree())),
    new MultiplyNode(new NumberNode(-1), new SinNode(u.toTree())),
    new MultiplyNode(
      new NumberNode(randint(-9, 10, [0])),
      new CosNode(new VariableNode("x")),
    ),
    new MultiplyNode(
      new NumberNode(randint(-9, 10, [0])),
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
export const isSinUCosUPrimitiveAnswerValid: VEA<Identifiers> = (
  ans,
  { isCos, coeffs },
) => {
  const u = new Polynomial(coeffs);
  const integratedFuction = isCos
    ? new SinNode(u.toTree({ forbidPowerToProduct: true }))
    : new OppositeNode(new CosNode(u.toTree({ forbidPowerToProduct: true })));

  const answer = new AddNode(integratedFuction, new VariableNode("C"));
  const texs = answer.toAllValidTexs();

  return texs.includes(ans);
};

export const sinUCosUPrimitive: Exercise<Identifiers> = {
  id: "sinUCosUPrimitive",
  connector: "=",
  label: "Primitive de $u'\\sin(u)$ et $u'\\cos(u)$",
  levels: ["TermSpé", "MathComp"],
  sections: ["Primitives", "Trigonométrie"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getSinUCosUPrimitive, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions: getSinUCosUPrimitivePropositions,
  isAnswerValid: isSinUCosUPrimitiveAnswerValid,
  subject: "Mathématiques",
};
