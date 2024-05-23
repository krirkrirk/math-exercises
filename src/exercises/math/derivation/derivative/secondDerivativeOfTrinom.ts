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
import { randint } from "#root/math/utils/random/randint";
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
  const trinom = TrinomConstructor.random();

  const trinomTree = trinom.toTree();
  const instruction = `Déterminer la fonction dérivée seconde $f''$ de la fonction $f$ définie par $f(x)=${trinomTree.toTex()}$.`;

  const correctAnswer = trinom.derivate().derivate().toTree();
  const question: Question<Identifiers> = {
    answer: correctAnswer.toTex(),
    instruction: instruction,
    keys: ["x"],
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
  let correctAnswer = 2 * a;
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      randint(correctAnswer - 11, correctAnswer + 11, [correctAnswer]) + "",
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a }) => {
  const correctAnswer = 2 * a;
  return correctAnswer + "" === ans;
};

const generateProposition = (
  a: number,
  b: number,
  c: number,
): AlgebraicNode[] => {
  const firstPropostion = new Polynomial([b, 2 * a], "x").toTree();
  const secondProposition = new Polynomial([c + b, 2 * a], "x").toTree();
  const thirdProposition = new NumberNode(a + b + c);

  return [firstPropostion, secondProposition, thirdProposition];
};

export const secondDerivativeOfTrinom: Exercise<Identifiers> = {
  id: "secondDerivativeOfTrinom",
  label: "Dérivée seconde d'un trinôme",
  levels: ["TermSpé"],
  isSingleStep: true,
  sections: ["Dérivation"],
  generator: (nb: number) =>
    getDistinctQuestions(getSecondDerivativeOfTrinomQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
