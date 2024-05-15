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

const getIntegralDerivatedUCosUQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const u = AffineConstructor.random();
  const cosU = new CosNode(u.toTree());
  const b = randint(-4, 6);
  const a = randint(-5, b);
  const integral = new IntegralNode(
    new MultiplyNode(u.derivate().toTree(), cosU),
    a.toTree(),
    b.toTree(),
    "x",
  );
  const correctAns = getCorrectAnswer(a, b, u);

  const question: Question<Identifiers> = {
    answer: correctAns.simplify().toTex(),
    instruction: `Calculer l'intégrale de $${integral.toTex()}$`,
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
  addValidProp(propositions, answer);
  generatePropositions(a, b, u).forEach((value) =>
    tryToAddWrongProp(propositions, value),
  );
  let sinA;
  let sinB;
  while (propositions.length < n) {
    sinA = new SinNode(randint(-11, 10, [0]).toTree());
    sinB = new SinNode(randint(-11, 10, [0]).toTree());
    tryToAddWrongProp(propositions, new SubstractNode(sinB, sinA).toTex());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, b, aU, bU }) => {
  const u = new Affine(aU, bU, "x");
  const correctAns = getCorrectAnswer(a, b, u).simplify();
  return correctAns.toAllValidTexs().includes(ans);
};

const getCorrectAnswer = (a: number, b: number, u: Polynomial) => {
  const uTree = u.toTree();
  const primitiveA = new SinNode(uTree.evaluate({ x: a }).toTree());
  const primitiveB = new SinNode(uTree.evaluate({ x: b }).toTree());
  return new SubstractNode(primitiveB, primitiveA);
};

const generatePropositions = (
  a: number,
  b: number,
  u: Polynomial,
): string[] => {
  const uTree = u.toTree();
  const uDerivated = u.derivate();
  const sinA = new SinNode(uTree.evaluate({ x: a }).toTree());
  const sinB = new SinNode(uTree.evaluate({ x: b }).toTree());
  const firstProposition = new AddNode(sinB, sinA).simplify();
  const secondProposition = new SubstractNode(sinA, sinB).simplify();
  const thirdProposition = new MultiplyNode(
    uDerivated.toTree(),
    new SinNode(uTree),
  ).simplify();
  return [
    firstProposition.toTex(),
    secondProposition.toTex(),
    thirdProposition.toTex(),
  ];
};

export const IntegralDerivatedUCosU: Exercise<Identifiers> = {
  id: "IntegralDerivatedUCosU",
  label: "Calcul d'intégrale du type $u'cos(u)$",
  levels: ["TermSpé"],
  isSingleStep: true,
  sections: ["Intégration"],
  generator: (nb: number) =>
    getDistinctQuestions(getIntegralDerivatedUCosUQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
