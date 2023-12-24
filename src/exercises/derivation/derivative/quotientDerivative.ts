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
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";

type QCMProps = {
  answer: string;
  answerDenum: string;
  poly1Coeffs: number[];
  poly2Coeffs: number[];
};
type VEAProps = {
  poly1Coeffs: number[];
  poly2Coeffs: number[];
};

const getProductDerivativeQuestion: QuestionGenerator<
  QCMProps,
  VEAProps
> = () => {
  const poly1 = PolynomialConstructor.randomWithLength(2, 2);
  let poly2: Polynomial;
  let isMultiple = false;
  do {
    poly2 = PolynomialConstructor.randomWithLength(2, 2);
    isMultiple =
      poly2.degree === poly1.degree &&
      poly2.coefficients.every(
        (coeff, index) =>
          coeff / poly1.coefficients[index] ===
          poly2.coefficients[0] / poly1.coefficients[0],
      );
  } while (isMultiple);
  const answerNum = poly1
    .derivate()
    .multiply(poly2)
    .add(poly1.opposite().multiply(poly2.derivate()))
    .toTree()
    .toTex();
  const answerDenum = new PowerNode(poly2.toTree(), new NumberNode(2)).toTex();
  const answer = `\\frac{${answerNum}}{${answerDenum}}`;

  const question: Question<QCMProps, VEAProps> = {
    answer,
    instruction: `Déterminer la dérivée de la fonction $f$ définie par $f(x) = ${new FractionNode(
      poly1.toTree(),
      poly2.toTree(),
    ).toTex()}$`,
    keys: ["x", "xsquare", "xcube"],
    answerFormat: "tex",
    qcmGeneratorProps: {
      answer,
      poly1Coeffs: poly1.coefficients,
      poly2Coeffs: poly2.coefficients,
      answerDenum,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (
  n,
  { answer, answerDenum, poly1Coeffs, poly2Coeffs },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const poly1 = new Polynomial(poly1Coeffs);
  const poly2 = new Polynomial(poly2Coeffs);
  tryToAddWrongProp(
    propositions,
    `\\frac{${poly1.derivate().toTree().toTex()}}{${poly2
      .derivate()
      .toTree()
      .toTex()}}`,
  );

  while (propositions.length < n) {
    const wrongAnswer = `\\frac{${PolynomialConstructor.random(2)
      .toTree()
      .toTex()}}{${answerDenum}}`;
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<VEAProps> = (ans, { poly1Coeffs, poly2Coeffs }) => {
  const poly1 = new Polynomial(poly1Coeffs);
  const poly2 = new Polynomial(poly2Coeffs);
  const answerNum = poly1
    .derivate()
    .multiply(poly2)
    .add(poly1.opposite().multiply(poly2.derivate()))
    .toTree({ forbidPowerToProduct: true });
  const answerDenum = new PowerNode(poly2.toTree(), new NumberNode(2));
  const answer = new FractionNode(answerNum, answerDenum);
  const texs = answer.toAllValidTexs();
  console.log(texs);
  return texs.includes(ans);
};

export const quotientDerivative: MathExercise<QCMProps, VEAProps> = {
  id: "quotientDerivative",
  connector: "=",
  label: "Dérivée d'un quotient de polynômes",
  levels: ["1reSpé", "MathComp"],
  isSingleStep: true,
  sections: ["Dérivation"],
  generator: (nb: number) =>
    getDistinctQuestions(getProductDerivativeQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
