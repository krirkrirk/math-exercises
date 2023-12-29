import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { PolynomialConstructor } from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import { coinFlip } from "#root/utils/coinFlip";
import { shuffle } from "#root/utils/shuffle";
import { v4 } from "uuid";

type Identifiers = {
  coeffs: number[];
  to: string;
};

const getSequencePolynomNoFILimitQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const length = randint(2, 5);
  const to = coinFlip() ? "+\\infty" : "-\\infty";
  const poly = PolynomialConstructor.randomNoFI(4, to, length);

  const answer = poly.getLimit(to);

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Déterminer la limite en $${to}$ de la fonction $f$ définie par : $f(x) = ${poly
      .toTree()
      .toTex()}$.`,
    keys: ["infty"],
    answerFormat: "tex",
    identifiers: { coeffs: poly.coefficients, to },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, coeffs }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  tryToAddWrongProp(propositions, "+\\infty");
  tryToAddWrongProp(propositions, "-\\infty");
  tryToAddWrongProp(propositions, "0");
  tryToAddWrongProp(propositions, coeffs[coeffs.length - 1] + "");

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(-10, 10) + "");
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const polynomLimitNoFI: MathExercise<Identifiers> = {
  id: "polynomLimitNoFI",
  connector: "=",
  label: "Limite d'une fonction polynomiale (sans F.I.)",
  levels: ["TermSpé", "MathComp"],
  isSingleStep: true,
  sections: ["Limites"],
  generator: (nb: number) =>
    getDistinctQuestions(getSequencePolynomNoFILimitQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
