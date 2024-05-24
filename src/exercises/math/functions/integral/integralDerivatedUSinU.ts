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
import { Affine, AffineConstructor } from "#root/math/polynomials/affine";
import { Polynomial } from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import { CosNode } from "#root/tree/nodes/functions/cosNode";
import { IntegralNode } from "#root/tree/nodes/functions/integralNode";
import { SinNode } from "#root/tree/nodes/functions/sinNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";

type Identifiers = {
  a: number;
  b: number;
  aU: number;
  bU: number;
};

const getIntegralDerivatedUSinUQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const u = AffineConstructor.random();

  const b = randint(-4, 6);
  const a = randint(-5, b);

  const integral = new IntegralNode(
    new MultiplyNode(u.derivate().toTree(), new SinNode(u.toTree())),
    a.toTree(),
    b.toTree(),
    "x",
  );

  const correctAns = getCorrectAnswer(a, b, u);

  const question: Question<Identifiers> = {
    answer: correctAns.simplify().toTex(),
    instruction: `Calculer : $${integral.toTex()}$`,
    keys: ["sin", "cos"],
    answerFormat: "tex",
    identifiers: { a, b, aU: u.a, bU: u.b },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, a, b, aU, bU },
) => {
  const propositions: Proposition[] = [];
  const u = new Affine(aU, bU, "x");

  generatePropositions(a, b, u).forEach((value) =>
    tryToAddWrongProp(propositions, value),
  );
  addValidProp(propositions, answer);

  let primitiveA;
  let primitiveB;
  const minusOne = (-1).toTree();

  while (propositions.length < n) {
    primitiveA = new MultiplyNode(
      minusOne,
      new CosNode(randint(-10, 11, [0]).toTree()),
    ).simplify();
    primitiveB = new MultiplyNode(
      minusOne,
      new CosNode(randint(-10, 11, [0]).toTree()),
    ).simplify();
    tryToAddWrongProp(
      propositions,
      new SubstractNode(primitiveB, primitiveA).simplify().toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, b, aU, bU }) => {
  const u = new Affine(aU, bU, "x");
  const correctAns = getCorrectAnswer(a, b, u).simplify();
  return correctAns.toAllValidTexs().includes(ans);
};

const getCorrectAnswer = (a: number, b: number, u: Polynomial) => {
  const minusOne = (-1).toTree();
  const uTree = u.toTree();

  const primitiveA = new MultiplyNode(
    minusOne,
    new CosNode(uTree.evaluate({ x: a }).toTree()),
  ).simplify();
  const primitiveB = new MultiplyNode(
    minusOne,
    new CosNode(uTree.evaluate({ x: b }).toTree()),
  ).simplify();

  return new SubstractNode(primitiveB, primitiveA);
};

const generatePropositions = (
  a: number,
  b: number,
  u: Polynomial,
): string[] => {
  const minusOne = (-1).toTree();
  const uTree = u.toTree();

  const uA = uTree.evaluate({ x: a }).toTree();
  const uB = uTree.evaluate({ x: b }).toTree();

  const sinA = new SinNode(uA);
  const sinB = new SinNode(uB);

  const primitiveA = new MultiplyNode(minusOne, new CosNode(uA)).simplify();
  const primitiveB = new MultiplyNode(minusOne, new CosNode(uB)).simplify();

  const firstProposition = new AddNode(primitiveB, primitiveA);

  const secondProposition = new AddNode(sinB, sinA).simplify();
  const thirdProposition = new SubstractNode(sinB, sinA).simplify();
  return [
    firstProposition.toTex(),
    secondProposition.toTex(),
    thirdProposition.toTex(),
  ];
};
export const integralDerivatedUSinU: Exercise<Identifiers> = {
  id: "integralDerivatedUSinU",
  label: "Calcul d'intégrales de fonctions du type $u'\\sin(u)$",
  levels: ["TermSpé"],
  isSingleStep: true,
  sections: ["Intégration"],
  generator: (nb: number) =>
    getDistinctQuestions(getIntegralDerivatedUSinUQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
