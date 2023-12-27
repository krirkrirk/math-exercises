import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { PolynomialConstructor } from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  answer: string;
  coeffs: number[];
};
type VEAProps = {};
const getSequencePolynomLimitQuestion: QuestionGenerator<Identifiers> = () => {
  const poly = PolynomialConstructor.random(4, "n");
  const to = "+\\infty";
  const answer = poly.getLimit(to);

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Déterminer la limite de la suite $u$ définie par : $u_n = ${poly
      .toTree()
      .toTex()}$.`,
    keys: ["infty"],
    answerFormat: "tex",
    identifiers: { answer, coeffs: poly.coefficients },
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

export const sequenceSimpleElementsSumLimit: MathExercise<Identifiers> = {
  id: "sequenceSimpleElementsSumLimit",
  connector: "=",
  label: "Limite d'une suite de sommes",
  levels: ["TermSpé", "MathComp"],
  isSingleStep: true,
  sections: ["Limites"],
  generator: (nb: number) =>
    getDistinctQuestions(getSequencePolynomLimitQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
