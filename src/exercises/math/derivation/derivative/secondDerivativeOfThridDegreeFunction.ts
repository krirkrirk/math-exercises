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
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { FunctionsIds } from "#root/tree/nodes/functions/functionNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";

type Identifiers = {
  a: number;
  b: number;
  c: number;
  d: number;
};

const getSecondDerivativeOfThridDegreeFunction: QuestionGenerator<
  Identifiers
> = () => {
  const funct = PolynomialConstructor.randomWithOrder(3, "x");
  const coefficients = funct.coefficients;
  const correctAnswer = funct.secondDerivate().toTree();
  const instruction = `Calculer la dérivée seconde de la fonction $f=${funct
    .toTree()
    .toTex()}$`;
  const coeff = {
    a: coefficients[3],
    b: coefficients[2],
    c: coefficients[1],
    d: coefficients[0],
  };
  const question: Question<Identifiers> = {
    answer: correctAnswer.toTex(),
    instruction: instruction,
    keys: ["x", "power"],
    answerFormat: "tex",
    identifiers: { ...coeff },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, a, b, c, d },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  generateProposition(a, b, c, d).forEach((value) =>
    tryToAddWrongProp(propositions, value.toTex()),
  );
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      PolynomialConstructor.random(2, "x").toTree().toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const generateProposition = (
  a: number,
  b: number,
  c: number,
  d: number,
): AlgebraicNode[] => {
  const polynom = new Polynomial([d, c, b, a], "x");
  const firstPropostion = polynom.derivate().toTree();
  const secondProposition = new Polynomial([c + d, 2 * b, 3 * a], "x").toTree();
  const thirdProposition = new Polynomial([b, a], "x").toTree();
  return [firstPropostion, secondProposition, thirdProposition];
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, b, c, d }) => {
  const result = new Polynomial([d, c, b, a], "x");
  return result.derivate().derivate().toTree().toAllValidTexs().includes(ans);
};
export const secondDerivativeOfThridDegreeFunction: Exercise<Identifiers> = {
  id: "secondDerivativeOfThridDegreeFunction",
  label: "Calcul de dérivée seconde d'une fonction (polynôme) de degré 3",
  levels: ["TermSpé"],
  isSingleStep: true,
  sections: ["Dérivation"],
  generator: (nb: number) =>
    getDistinctQuestions(getSecondDerivativeOfThridDegreeFunction, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
