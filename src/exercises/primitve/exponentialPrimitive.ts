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
import {
  Polynomial,
  PolynomialConstructor,
} from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import { ExpNode } from "#root/tree/nodes/functions/expNode";
import { Node } from "#root/tree/nodes/node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";

type QCMProps = {
  answer: string;
  a: number;
};
type VEAProps = {
  a: number;
};
export const getExponentialPrimitive: QuestionGenerator<
  QCMProps,
  VEAProps
> = () => {
  const a = randint(-9, 10, [0]);

  const integratedFuction = new MultiplyNode(
    new NumberNode(a),
    new ExpNode(new VariableNode("x")),
  );
  const answer = new AddNode(integratedFuction, new VariableNode("C")).toTex();

  const question: Question<QCMProps, VEAProps> = {
    instruction: `Déterminer la forme générale des primitives de la fonction $f$ définie par $f(x) = ${integratedFuction.toTex()}$.`,
    startStatement: `F(x)`,
    answer,
    keys: ["x", "C", "epower", "exp"],
    answerFormat: "tex",
    qcmGeneratorProps: { answer, a },
  };

  return question;
};

export const getExponentialPrimitivePropositions: QCMGenerator<QCMProps> = (
  n,
  { answer, a },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const aNode = new NumberNode(a);
  const xNode = new VariableNode("x");
  const expXTree = new ExpNode(new VariableNode("x"));

  const wrongIntegrals = [
    new MultiplyNode(new NumberNode(-a), expXTree),
    new MultiplyNode(aNode, new ExpNode(new MultiplyNode(aNode, xNode))),
    new MultiplyNode(aNode, new ExpNode(new FractionNode(xNode, aNode))),
    new MultiplyNode(aNode, new ExpNode(new AddNode(xNode, aNode))),
    new MultiplyNode(aNode, new ExpNode(new PowerNode(xNode, aNode))),
    expXTree,
  ];
  const cNode = new VariableNode("C");
  wrongIntegrals.forEach((node) =>
    tryToAddWrongProp(propositions, new AddNode(node, cNode).toTex()),
  );

  while (propositions.length < n) {
    let wrongIntegral = new MultiplyNode(
      new NumberNode(randint(-10, 10, [0])),
      expXTree,
    );
    tryToAddWrongProp(propositions, new AddNode(wrongIntegral, cNode).toTex());
  }
  return shuffleProps(propositions, n);
};

export const isExponentialPrimitiveAnswerValid: VEA<VEAProps> = (
  ans,
  { a },
) => {
  const integratedFuction = new MultiplyNode(
    new NumberNode(a),
    new ExpNode(new VariableNode("x")),
  );
  const answer = new AddNode(integratedFuction, new VariableNode("C"));
  const texs = answer.toAllValidTexs();
  console.log(texs);
  return texs.includes(ans);
};

export const exponentialPrimitive: MathExercise<QCMProps, VEAProps> = {
  id: "exponentialPrimitive",
  connector: "=",
  label: "Primitive de la fonction exponentielle",
  levels: ["TermSpé", "MathComp"],
  sections: ["Primitives", "Exponentielle"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getExponentialPrimitive, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions: getExponentialPrimitivePropositions,
  isAnswerValid: isExponentialPrimitiveAnswerValid,
};
