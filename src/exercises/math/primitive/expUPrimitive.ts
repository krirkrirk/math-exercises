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
import {
  Polynomial,
  PolynomialConstructor,
} from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import { ExpNode } from "#root/tree/nodes/functions/expNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";

type Identifiers = {
  coeffs: number[];
};

export const getExpUPrimitive: QuestionGenerator<Identifiers> = () => {
  const u = PolynomialConstructor.randomWithOrder(randint(1, 3));

  const integratedFuction = new ExpNode(u.toTree());
  const selectedFunction = new MultiplyNode(
    u.derivate().toTree(),
    integratedFuction,
  );

  const answer = new AddNode(integratedFuction, new VariableNode("C")).toTex();
  const question: Question<Identifiers> = {
    instruction: `Déterminer la forme générale des primitives de la fonction $f$ définie par $f(x) = ${selectedFunction.toTex()}$.`,
    startStatement: `F(x)`,
    answer,
    keys: ["x", "C", "epower", "exp"],
    answerFormat: "tex",
    identifiers: { coeffs: u.coefficients },
  };

  return question;
};

export const getExpUPrimitivePropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, coeffs },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const u = new Polynomial(coeffs);
  const uTree = u.toTree();
  const expXTree = new ExpNode(new VariableNode("x"));
  const expUTree = new ExpNode(uTree);
  const invUTree = new FractionNode(new NumberNode(1), uTree);
  const wrongIntegrals = [
    new MultiplyNode(uTree, expUTree),
    new MultiplyNode(u.derivate().toTree(), expUTree),
    new MultiplyNode(uTree, expXTree),
    new MultiplyNode(invUTree, expXTree),
    new MultiplyNode(invUTree, expUTree),
    new MultiplyNode(new NumberNode(randint(-9, 10, [0])), expUTree),
  ];
  const cNode = new VariableNode("c");
  wrongIntegrals.forEach((node) =>
    tryToAddWrongProp(propositions, new AddNode(node, cNode).toTex()),
  );

  while (propositions.length < n) {
    let wrongIntegral = new AddNode(
      new MultiplyNode(new NumberNode(randint(-10, 10, [0])), expXTree),
      cNode,
    ).toTex();
    tryToAddWrongProp(propositions, wrongIntegral);
  }
  return shuffleProps(propositions, n);
};

export const isExpUPrimitiveAnswerValid: VEA<Identifiers> = (
  ans,
  { coeffs },
) => {
  const u = new Polynomial(coeffs);
  const integratedFuction = new ExpNode(
    u.toTree({ forbidPowerToProduct: true }),
  );
  const answer = new AddNode(integratedFuction, new VariableNode("C"));
  const texs = answer.toAllValidTexs();

  return texs.includes(ans);
};
export const expUPrimitive: Exercise<Identifiers> = {
  id: "expUPrimitive",
  connector: "=",
  label: "Primitive de $u'\\exp(u)$",
  levels: ["TermSpé", "MathComp"],
  sections: ["Primitives", "Exponentielle"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getExpUPrimitive, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions: getExpUPrimitivePropositions,
  isAnswerValid: isExpUPrimitiveAnswerValid,
  subject: "Mathématiques",
  pdfOptions: { shouldSpreadPropositions: true },
};
