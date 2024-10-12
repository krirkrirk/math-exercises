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
import { coinFlip } from "#root/utils/alea/coinFlip";
import { shuffle } from "#root/utils/alea/shuffle";
import { v4 } from "uuid";
type Identifiers = {
  coeffs: number[];
  to: string;
};

const getPolynomLimitQuestion: QuestionGenerator<Identifiers> = () => {
  const poly = PolynomialConstructor.random(4);
  const to = coinFlip() ? "+\\infty" : "-\\infty";
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
    const wrongAnswer = randint(-10, 10) + "";
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const polynomLimit: Exercise<Identifiers> = {
  id: "polynomLimit",
  connector: "=",
  label: "Limite d'une fonction polynomiale",
  levels: ["TermSpé", "MathComp"],
  isSingleStep: true,
  sections: ["Limites"],
  generator: (nb: number) => getDistinctQuestions(getPolynomLimitQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
