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
import { Affine } from "#root/math/polynomials/affine";
import { Polynomial } from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import { LogNode } from "#root/tree/nodes/functions/logNode";
import { Node } from "#root/tree/nodes/node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { simplifyNode } from "#root/tree/parsers/simplify";

type QCMProps = {
  answer: string;
  a: number;
  b: number;
};
type VEAProps = {
  a: number;
  b: number;
};

const getLnDerivative: QuestionGenerator<QCMProps, VEAProps> = () => {
  const a = randint(-9, 10, [0]);
  const b = randint(-9, 10);
  const affine = new Polynomial([b, a]).toTree();
  const myfunction = new MultiplyNode(
    affine,
    new LogNode(new VariableNode("x")),
  );

  const derivative = simplifyNode(
    new AddNode(
      new MultiplyNode(new NumberNode(a), new LogNode(new VariableNode("x"))),
      new FractionNode(affine, new VariableNode("x")),
    ),
  );

  const answer = derivative.toTex();

  const question: Question<QCMProps, VEAProps> = {
    instruction: `Déterminer la dérivée de la fonction $f(x) = ${myfunction.toTex()} $.`,
    startStatement: "f'(x)",
    answer,
    keys: ["x", "ln", "epower"],
    answerFormat: "tex",
    qcmGeneratorProps: { answer, a, b },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, a, b }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const affine = new Affine(a, b).toTree();
  tryToAddWrongProp(
    propositions,
    new FractionNode(new NumberNode(a), new VariableNode("x")).toTex(),
  );
  tryToAddWrongProp(
    propositions,
    new FractionNode(affine, new VariableNode("x")).toTex(),
  );
  if (a === 1) tryToAddWrongProp(propositions, "\\ln\\left(x\\right)");
  else tryToAddWrongProp(propositions, `${a}\\ln\\left(x\\right)`);

  while (propositions.length < n) {
    const randomA = randint(-9, 10, [0]);
    const randomB = randint(-9, 10);
    tryToAddWrongProp(
      propositions,
      simplifyNode(
        new AddNode(
          new MultiplyNode(
            new NumberNode(randomA),
            new LogNode(new VariableNode("x")),
          ),
          new FractionNode(
            new Polynomial([randomB, randomA]).toTree(),
            new VariableNode("x"),
          ),
        ),
      ).toTex(),
    );
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<VEAProps> = (ans, { a, b }) => {
  const xNode = new VariableNode("x");
  const aNode = new NumberNode(a);
  const bNode = new FractionNode(new NumberNode(b), xNode);
  const logNode = new LogNode(xNode);
  let developped = new AddNode(new MultiplyNode(aNode, logNode), aNode);
  let simplified: Node = new MultiplyNode(
    aNode,
    new AddNode(logNode, new NumberNode(1)),
  );
  if (b !== 0) {
    developped = new AddNode(developped, bNode);
    simplified = new AddNode(simplified, bNode);
  }
  const texs = [...developped.toAllValidTexs(), ...simplified.toAllValidTexs()];
  console.log(texs);
  return texs.includes(ans);
};

export const lnDerivativeThree: MathExercise<QCMProps, VEAProps> = {
  id: "lnDerivativeThree",
  connector: "=",
  label: "Dérivée de $\\ln(x) \\times (ax+b)$",
  levels: ["1reESM", "1reSpé", "1reTech", "MathComp", "TermSpé"],
  sections: ["Dérivation", "Logarithme népérien"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getLnDerivative, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
