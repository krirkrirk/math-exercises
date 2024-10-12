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
import { Rational } from "#root/math/numbers/rationals/rational";
import { Monom } from "#root/math/polynomials/monom";
import { PolynomialConstructor } from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import { shuffle } from "#root/utils/alea/shuffle";

type Identifiers = {
  polyNumCoeffs: number[];
  polyDenumCoeffs: number[];
};

const getSequencePolynomProductLimitQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const polyNum = PolynomialConstructor.randomWithLength(3, 2, "n");
  const polyDenum = PolynomialConstructor.randomWithLength(3, 2, "n");
  const numLeadingCoeff = polyNum.coefficients[polyNum.degree];
  const denumLeadingCoeff = polyDenum.coefficients[polyDenum.degree];

  const product = new Monom(
    polyNum.degree + polyDenum.degree,
    numLeadingCoeff * denumLeadingCoeff,
    "n",
  );
  const to = "+\\infty";
  let answer = product.getLimit(to);
  let leadingCoeffsRational = new Rational(numLeadingCoeff, denumLeadingCoeff)
    .simplify()
    .toTree()
    .toTex();

  const question: Question<Identifiers> = {
    answer,
    instruction: `Déterminer la limite de la suite $u$ définie par : $u_n = (${polyNum
      .toTree()
      .toTex()})(${polyDenum.toTree().toTex()})$.`,
    keys: ["infty"],
    answerFormat: "tex",
    identifiers: {
      polyDenumCoeffs: polyDenum.coefficients,
      polyNumCoeffs: polyNum.coefficients,
    },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, polyDenumCoeffs, polyNumCoeffs },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const numLeadingCoeff = polyNumCoeffs[polyNumCoeffs.length - 1];
  const denumLeadingCoeff = polyDenumCoeffs[polyDenumCoeffs.length - 1];

  let leadingCoeffsRational = new Rational(numLeadingCoeff, denumLeadingCoeff)
    .simplify()
    .toTree()
    .toTex();
  tryToAddWrongProp(propositions, "+\\infty");
  tryToAddWrongProp(propositions, "-\\infty");
  tryToAddWrongProp(propositions, "0");
  tryToAddWrongProp(propositions, leadingCoeffsRational);

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(-10, 10) + "");
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const sequencePolynomProductLimit: Exercise<Identifiers> = {
  id: "sequencePolynomProductLimit",
  connector: "=",
  label: "Limite d'un produit de suites polynomiales",
  levels: ["TermSpé", "MathComp"],
  isSingleStep: true,
  sections: ["Limites", "Suites"],
  generator: (nb: number) =>
    getDistinctQuestions(getSequencePolynomProductLimitQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
