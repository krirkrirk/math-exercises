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
import { Polynomial } from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import { ExpNode } from "#root/tree/nodes/functions/expNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";

type Identifiers = {
  a: number;
  b: number;
};

const getExpDerivativeThree: QuestionGenerator<Identifiers> = () => {
  const a = randint(-9, 10, [0]);
  const b = randint(-9, 10);

  const myfunction = new MultiplyNode(
    new Polynomial([b, a]).toTree(),
    new ExpNode(new VariableNode("x")),
  );
  const derivative = new MultiplyNode(
    new Polynomial([b + a, a]).toTree(),
    new ExpNode(new VariableNode("x")),
  );
  const answer = derivative.toTex();
  const question: Question<Identifiers> = {
    instruction: `Déterminer la dérivée de la fonction $f(x) = ${myfunction.toTex()}$.`,
    startStatement: "f'(x)",
    answer,
    keys: ["x", "epower", "exp"],
    answerFormat: "tex",
    identifiers: { a, b },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a, b }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  tryToAddWrongProp(
    propositions,
    new MultiplyNode(
      new NumberNode(a),
      new ExpNode(new VariableNode("x")),
    ).toTex(),
  );
  tryToAddWrongProp(
    propositions,
    new MultiplyNode(
      new Polynomial([b + a, -a]).toTree(),
      new ExpNode(new VariableNode("x")),
    ).toTex(),
  );
  tryToAddWrongProp(propositions, a + "");
  tryToAddWrongProp(
    propositions,
    new MultiplyNode(
      new MultiplyNode(new NumberNode(a), new VariableNode("x")),
      new ExpNode(new VariableNode("x")),
    ).toTex(),
  );

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, b }) => {
  const affine = new Polynomial([a + b, a]).toTree();
  const derivative = new MultiplyNode(
    affine,
    new ExpNode(new VariableNode("x")),
  );
  const texs = derivative.toAllValidTexs();
  return texs.includes(ans);
};

export const expDerivativeThree: Exercise<Identifiers> = {
  id: "expDerivativeThree",
  connector: "=",
  label: "Dérivée de $(ax+b) \\times \\exp(x)$",
  levels: ["1reESM", "1reSpé", "1reTech", "MathComp"],
  sections: ["Dérivation", "Exponentielle"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getExpDerivativeThree, nb),
  getPropositions,
  qcmTimer: 60,
  freeTimer: 60,
  isAnswerValid,
  subject: "Mathématiques",
};
