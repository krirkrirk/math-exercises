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
import {
  Polynomial,
  PolynomialConstructor,
} from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  coeffs: number[];
};

export const getPolynomialPrimitive: QuestionGenerator<Identifiers> = () => {
  const degree = randint(1, 4);
  const polynomial = PolynomialConstructor.randomWithOrder(degree);

  const integralPolynomial = polynomial.integrateToNode();

  const answer = `${integralPolynomial.toTex()}`;
  const question: Question<Identifiers> = {
    instruction: `Déterminer la forme générale des primitives de la fonction polynomiale $f$ définie par $f(x) = ${polynomial.toTex()}$.`,
    startStatement: `F(x)`,
    answer,
    keys: ["x", "C"],
    answerFormat: "tex",
    identifiers: { coeffs: polynomial.coefficients },
  };

  return question;
};

export const getPolynomialPrimitivePropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, coeffs },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const wrongPolynomial = PolynomialConstructor.randomWithOrder(
      coeffs.length - 1,
    );
    const wrongIntegral = wrongPolynomial.integrateToNode();
    tryToAddWrongProp(propositions, wrongIntegral.toTex());
  }
  return shuffle(propositions);
};

export const isPolynomialPrimitiveAnswerValid: VEA<Identifiers> = (
  ans,
  { coeffs },
) => {
  const opts = {
    allowFractionToDecimal: true,
    forbidPowerToProduct: true,
  };
  const polynomial = new Polynomial(coeffs);
  const integralPolynomial = polynomial.integrateToNode(opts);
  const texs = integralPolynomial.toAllValidTexs(opts);
  console.log(texs);
  return texs.includes(ans);
};

export const polynomialPrimitive: MathExercise<Identifiers> = {
  id: "polynomialPrimitive",
  connector: "=",
  label: "Primitive d'une fonction polynomiale",
  levels: ["TermSpé", "MathComp"],
  sections: ["Primitives"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getPolynomialPrimitive, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions: getPolynomialPrimitivePropositions,
  isAnswerValid: isPolynomialPrimitiveAnswerValid,
};
