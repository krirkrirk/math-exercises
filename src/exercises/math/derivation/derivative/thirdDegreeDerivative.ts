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
import { Polynomial } from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";

type Identifiers = {
  coefficients: number[];
};

export const getThirdDegreeDerivative: QuestionGenerator<Identifiers> = () => {
  const coefficients: number[] = [];

  for (let i = 1; i <= 3; i++) coefficients.push(randint(-9, 10));
  coefficients.push(randint(-9, 10, [0]));

  const polynomial = new Polynomial(coefficients);
  const derivative = polynomial.derivate();
  const answer = derivative.toTree().toTex();

  const question: Question<Identifiers> = {
    instruction: `Déterminer la fonction dérivée $f'$ de la fonction $f$ définie par $f(x) = ${polynomial
      .toTree()
      .toTex()}$.`,
    startStatement: `f'(x)`,
    answer: answer,
    keys: ["x"],
    answerFormat: "tex",
    identifiers: { coefficients },
  };

  return question;
};

export const getThirdDegreeDerivativePropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, coefficients },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  if (coefficients[2] !== 0)
    tryToAddWrongProp(
      propositions,
      new Polynomial([coefficients[0], coefficients[1], coefficients[2]])
        .toTree()
        .toTex(),
    );
  if (coefficients[2] !== 0)
    tryToAddWrongProp(
      propositions,
      new Polynomial([
        coefficients[0] + coefficients[1],
        coefficients[1],
        coefficients[2],
      ])
        .toTree()
        .toTex(),
    );

  while (propositions.length < n) {
    const randomCoefficients = [];

    for (let j = 1; j <= 3; j++) randomCoefficients.push(randint(-9, 10));
    randomCoefficients.push(randint(-9, 10, [0]));

    const randomPolynomial = new Polynomial(randomCoefficients);
    tryToAddWrongProp(propositions, randomPolynomial.derivate().toString());
  }

  return shuffleProps(propositions, n);
};

export const isThirdDegreeDerivativeAnswerValid: VEA<Identifiers> = (
  ans,
  { coefficients },
) => {
  const polynomial = new Polynomial(coefficients);
  const derivative = polynomial.derivate().toTree();
  const texs = derivative.toAllValidTexs();
  return texs.includes(ans);
};
export const thirdDegreeDerivative: Exercise<Identifiers> = {
  id: "thirdDegreeDerivative",
  connector: "=",
  label: "Dérivée d'un polynôme de degré 3",
  levels: [
    "1reESM",
    "1reSpé",
    "1reTech",
    "MathComp",
    "1rePro",
    "TermPro",
    "TermTech",
  ],
  sections: ["Dérivation"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getThirdDegreeDerivative, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions: getThirdDegreeDerivativePropositions,
  isAnswerValid: isThirdDegreeDerivativeAnswerValid,
  subject: "Mathématiques",
};
