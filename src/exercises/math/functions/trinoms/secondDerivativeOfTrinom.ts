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
import { Trinom, TrinomConstructor } from "#root/math/polynomials/trinom";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";

type Identifiers = {
  a: number;
  b: number;
  c: number;
};

const getSecondDerivativeOfTrinomQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const trinom = TrinomConstructor.random(
    {
      min: -11,
      max: 11,
      excludes: [0],
    },
    {
      min: -11,
      max: 11,
      excludes: [0],
    },
    {
      min: -11,
      max: 11,
      excludes: [0],
    },
  );
  const trinomTree = trinom.toTree();
  const instruction = `Calculer la dérivée seconde de la fonction $f=${trinomTree.toTex()}$`;

  const correctAnswer = trinom.derivate().derivate().toTree();
  const question: Question<Identifiers> = {
    answer: correctAnswer.toTex(),
    instruction: instruction,
    keys: ["power", "x"],
    answerFormat: "tex",
    identifiers: { a: trinom.a, b: trinom.b, c: trinom.c },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a, b, c }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  generateProposition(a, b, c).forEach((value) =>
    tryToAddWrongProp(propositions, value.toTex()),
  );
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      PolynomialConstructor.random(1, "x").toTree().toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, b, c }) => {
  const correctAnswer = new Polynomial([b, 2 * a], "x").toTree();
  return correctAnswer.toAllValidTexs().includes(ans);
};

const generateProposition = (
  a: number,
  b: number,
  c: number,
): AlgebraicNode[] => {
  const trinom = new Trinom(a, b, c);
  const firstPropostion = trinom.derivate().toTree();
  const secondProposition = new Polynomial([b, 2 * a], "x").toTree();
  const thirdProposition = new NumberNode(a + b + c);

  return [firstPropostion, secondProposition, thirdProposition];
};

export const secondDerivativeOfTrinom: Exercise<Identifiers> = {
  id: "secondDerivativeOfTrinom",
  label: "Calcul de Dérivée seconde d'un trinome",
  levels: [],
  isSingleStep: true,
  sections: ["Fonctions"],
  generator: (nb: number) =>
    getDistinctQuestions(getSecondDerivativeOfTrinomQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
