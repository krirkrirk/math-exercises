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
import { expUDerivate } from "#root/math/utils/functions/expUDerivate";
import { expuSecondDerivative } from "#root/math/utils/functions/expUSecondDerivate";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { ExpNode } from "#root/tree/nodes/functions/expNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";

type Identifiers = {
  coeffs: number[];
};

const getSecondDerivativeOfExpoFunctionQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const polynom = PolynomialConstructor.randomWithOrder(1, "x");
  const funct = new ExpNode(polynom.toTree());
  const correctAnswer = expuSecondDerivative(funct, polynom);
  const question: Question<Identifiers> = {
    answer: correctAnswer.toTex(),
    instruction: `Déterminer la fonction dérivée seconde $f''$ de la fonction $f$ définie par $f(x)=${funct.toTex()}$`,
    keys: ["epower", "x"],
    answerFormat: "tex",
    identifiers: { coeffs: polynom.coefficients },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, coeffs }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  generateProposition(coeffs).forEach((value) =>
    tryToAddWrongProp(propositions, value.toTex()),
  );
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      new ExpNode(PolynomialConstructor.random(2).toTree()).toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { coeffs }) => {
  const polynom = new Polynomial(coeffs, "x");
  const e = new ExpNode(polynom.toTree());
  const correctAnswer = expuSecondDerivative(e, polynom);
  return correctAnswer.toAllValidTexs().includes(ans);
};

const generateProposition = (coeffs: number[]): AlgebraicNode[] => {
  const u = new Polynomial(coeffs, "x");
  const e = new ExpNode(u.toTree());
  const firstPropostion = expUDerivate(e, u);
  const secondProposition = new MultiplyNode(u.toTree(), firstPropostion);
  const thirdProposition = new ExpNode(u.derivate().toTree());
  return [firstPropostion, secondProposition, thirdProposition];
};
export const secondDerivativeOfExpoFunction: Exercise<Identifiers> = {
  id: "secondDerivativeOfExpoFunction",
  label: "Calcul de la dérivée seconde d'une fonction exp(u)",
  levels: ["TermSpé"],
  isSingleStep: true,
  sections: ["Dérivation"],
  generator: (nb: number) =>
    getDistinctQuestions(getSecondDerivativeOfExpoFunctionQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
