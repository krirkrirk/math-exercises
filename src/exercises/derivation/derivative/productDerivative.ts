import {
  shuffleProps,
  MathExercise,
  Proposition,
  Question,
  tryToAddWrongProp,
  QuestionGenerator,
  addValidProp,
  QCMGenerator,
  VEA,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import {
  Polynomial,
  PolynomialConstructor,
} from "#root/math/polynomials/polynomial";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";

type Identifiers = {
  poly1Coeffs: number[];
  poly2Coeffs: number[];
};

const getProductDerivativeQuestion: QuestionGenerator<Identifiers> = () => {
  const poly1 = PolynomialConstructor.randomWithLength(3, 2);
  const poly2 = PolynomialConstructor.randomWithLength(3, 2);
  const answer = poly1.multiply(poly2).derivate().toTree().toTex();

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Déterminer la dérivée de la fonction $f$ définie par $f(x) = ${new MultiplyNode(
      poly1.toTree(),
      poly2.toTree(),
    ).toTex()}$`,
    keys: ["x", "xsquare", "xcube"],
    answerFormat: "tex",
    identifiers: {
      poly1Coeffs: poly1.coefficients,
      poly2Coeffs: poly2.coefficients,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, poly1Coeffs, poly2Coeffs },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const poly1 = new Polynomial(poly1Coeffs);
  const poly2 = new Polynomial(poly2Coeffs);
  tryToAddWrongProp(
    propositions,
    poly1.derivate().multiply(poly2.derivate()).toTree().toTex(),
  );
  tryToAddWrongProp(
    propositions,
    poly1.derivate().add(poly2.derivate()).toTree().toTex(),
  );

  while (propositions.length < n) {
    const wrongAnswer = PolynomialConstructor.random(3).toTree().toTex();

    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffleProps(propositions, n);
};
const isAnswerValid: VEA<Identifiers> = (ans, { poly1Coeffs, poly2Coeffs }) => {
  const poly1 = new Polynomial(poly1Coeffs);
  const poly2 = new Polynomial(poly2Coeffs);
  const answer = poly1
    .multiply(poly2)
    .derivate()
    .toTree({ forbidPowerToProduct: true });
  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};

export const productDerivative: MathExercise<Identifiers> = {
  id: "productDerivative",
  connector: "=",
  getPropositions,
  label: "Dérivée d'un produit de polynômes",
  levels: ["1reSpé", "MathComp"],
  isSingleStep: true,
  sections: ["Dérivation"],
  generator: (nb: number) =>
    getDistinctQuestions(getProductDerivativeQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  isAnswerValid,
};
