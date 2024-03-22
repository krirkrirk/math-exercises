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
import {
  Polynomial,
  PolynomialConstructor,
} from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import { Node } from "#root/tree/nodes/node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  numCoeffs: number[];
  denumCoeffs: number[];
};

const getSequenceRationalFracLimitQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const polyNum = PolynomialConstructor.random(4, "n");
  const polyDenum = PolynomialConstructor.random(4, "n");
  const numLeadingCoeff = polyNum.coefficients[polyNum.degree];
  const denumLeadingCoeff = polyDenum.coefficients[polyDenum.degree];

  const to = "+\\infty";
  let answer: string;
  let leadingCoeffsRational = new Rational(numLeadingCoeff, denumLeadingCoeff)
    .simplify()
    .toTree()
    .toTex();
  if (polyDenum.degree === polyNum.degree) {
    answer = leadingCoeffsRational;
  } else if (polyDenum.degree > polyNum.degree) {
    answer = "0";
  } else {
    const tempPoly = new Monom(
      polyNum.degree - polyDenum.degree,
      numLeadingCoeff * denumLeadingCoeff > 0 ? 1 : -1,
      "n",
    );
    answer = tempPoly.getLimit(to);
  }

  const question: Question<Identifiers> = {
    answer,
    instruction: `Déterminer la limite de la suite $u$ définie par : $u_n = \\dfrac{${polyNum
      .toTree()
      .toTex()}}{${polyDenum.toTree().toTex()}}$.`,
    keys: ["infty"],
    answerFormat: "tex",
    identifiers: {
      numCoeffs: polyNum.coefficients,
      denumCoeffs: polyDenum.coefficients,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, numCoeffs, denumCoeffs },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const numLeadingCoeff = numCoeffs[numCoeffs.length - 1];
  const denumLeadingCoeff = denumCoeffs[denumCoeffs.length - 1];

  const to = "+\\infty";
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

const isAnswerValid: VEA<Identifiers> = (ans, { denumCoeffs, numCoeffs }) => {
  const numDegree = numCoeffs.length - 1;
  const denumDegree = denumCoeffs.length - 1;
  const numLeadingCoeff = numCoeffs[numDegree];
  const denumLeadingCoeff = denumCoeffs[denumDegree];

  let leadingCoeffsRational = new Rational(numLeadingCoeff, denumLeadingCoeff)
    .simplify()
    .toTree({ allowFractionToDecimal: true });

  let answer: Node;
  if (denumDegree === numDegree) {
    answer = leadingCoeffsRational;
  } else if (denumDegree > numDegree) {
    answer = new NumberNode(0);
  } else {
    const tempPoly = new Monom(
      numDegree - denumDegree,
      numLeadingCoeff * denumLeadingCoeff > 0 ? 1 : -1,
    );
    answer = tempPoly.getLimitNode("+\\infty");
  }
  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};

export const sequenceRationalFracLimit: Exercise<Identifiers> = {
  id: "sequenceRationalFracLimit",
  connector: "=",
  label: "Limite d'une suite rationnelle",
  levels: ["TermSpé", "MathComp"],
  isSingleStep: true,
  sections: ["Limites", "Suites"],
  generator: (nb: number) =>
    getDistinctQuestions(getSequenceRationalFracLimitQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
