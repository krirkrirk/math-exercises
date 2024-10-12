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
import { AbsNode } from "#root/tree/nodes/functions/absNode";
import { LogNode } from "#root/tree/nodes/functions/logNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { shuffle } from "#root/utils/alea/shuffle";

type Identifiers = {
  coeffs: number[];
};

export const getLogarithmePrimitive: QuestionGenerator<Identifiers> = () => {
  const u = PolynomialConstructor.randomWithOrder(randint(1, 3));
  const uTree = u.toTree();
  const selectedFunction = new FractionNode(u.derivate().toTree(), uTree);
  const integratedFuction = new LogNode(new AbsNode(uTree));
  const answer = new AddNode(integratedFuction, new VariableNode("C")).toTex();
  const question: Question<Identifiers> = {
    instruction: `Déterminer la forme générale des primitives de la fonction $f$ définie par $f(x) = ${selectedFunction.toTex()}$.`,
    startStatement: `F(x)`,
    answer,
    keys: ["x", "C", "ln", "abs"],
    answerFormat: "tex",
    identifiers: { coeffs: u.coefficients },
  };

  return question;
};

export const getLogarithmePrimitivePropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, coeffs },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const u = new Polynomial(coeffs);
  const uTree = u.toTree();
  const wrongIntegrals = [
    new FractionNode(
      u.derivate().toTree(),
      new PowerNode(uTree, new NumberNode(2)),
    ),
    new FractionNode(
      u.derivate().opposite().toTree(),
      new PowerNode(uTree, new NumberNode(2)),
    ),
    new LogNode(new PowerNode(uTree, new NumberNode(2))),
  ];
  const cNode = new VariableNode("C");

  wrongIntegrals.forEach((int) =>
    tryToAddWrongProp(propositions, new AddNode(int, cNode).toTex()),
  );

  // while (propositions.length < n) {
  //  const wrongIntegral =
  //     new PowerNode(u.toTree(), new NumberNode(2)).toTex(),
  //     `ln\|${PolynomialConstructor.randomWithOrder(randint(1, 3)).toTex()}\|`,
  //   );
  //   let wrongIntegral;
  //   wrongIntegral = wrongIntegrals[randint(0, wrongIntegrals.length)];
  //   tryToAddWrongProp(propositions, `${wrongIntegral} + C`);
  //   wrongIntegrals.pop();
  // }

  return shuffle(propositions);
};

const isLogarithmePrimitiveAnswerValid: VEA<Identifiers> = (
  ans,
  { coeffs },
) => {
  const u = new Polynomial(coeffs);
  const uTree = u.toTree({ forbidPowerToProduct: true });
  const integratedFuction = new LogNode(new AbsNode(uTree));
  const answer = new AddNode(integratedFuction, new VariableNode("C"));
  const texs = answer.toAllValidTexs();

  return texs.includes(ans);
};

export const logarithmePrimitive: Exercise<Identifiers> = {
  id: "logarithmePrimitive",
  connector: "=",
  label: "Primitive de $\\frac{u'}{u}$",
  levels: ["TermSpé", "MathComp"],
  sections: ["Primitives", "Logarithme népérien"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getLogarithmePrimitive, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions: getLogarithmePrimitivePropositions,
  isAnswerValid: isLogarithmePrimitiveAnswerValid,
  subject: "Mathématiques",
};
