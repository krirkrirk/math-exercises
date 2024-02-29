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
import { Polynomial } from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import { shuffle } from "#root/utils/shuffle";
import { v4 } from "uuid";

type Identifiers = {
  coefficients: number[];
};

export const getSecondDegreeDerivative: QuestionGenerator<Identifiers> = () => {
  const coefficients = [randint(-9, 10), randint(-9, 10), randint(-9, 10, [0])];

  const polynomial = new Polynomial(coefficients);
  const derivative = polynomial.derivate();
  const answer = derivative.toTree().toTex();
  const question: Question<Identifiers> = {
    instruction: `Déterminer la fonction dérivée $f'$ de la fonction $f$ définie par $f(x) = ${polynomial.toString()}$.`,
    startStatement: `f'(x)`,
    answer,
    keys: ["x"],
    answerFormat: "tex",
    identifiers: { coefficients },
  };

  return question;
};

export const getSecondDegreeDerivativePropositions: QCMGenerator<
  Identifiers
> = (n, { answer, coefficients }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  if (coefficients[1] !== 0)
    tryToAddWrongProp(
      propositions,
      new Polynomial([coefficients[0], coefficients[1]]).toTree().toTex(),
    );
  if (coefficients[1] !== 0)
    tryToAddWrongProp(
      propositions,
      new Polynomial([coefficients[0] + coefficients[1], coefficients[1]])
        .toTree()
        .toTex(),
    );
  while (propositions.length < n) {
    const randomCoefficients = [
      randint(-9, 10),
      coefficients[1] + randint(-3, 4),
      coefficients[2] + randint(-3, 4, [0, -coefficients[2]]),
    ];
    const randomPolynomial = new Polynomial(randomCoefficients);
    tryToAddWrongProp(propositions, randomPolynomial.derivate().toString());
  }

  return shuffle(propositions);
};
export const isSecondDegreeDerivativeAnswerValid: VEA<Identifiers> = (
  ans,
  { coefficients },
) => {
  const polynomial = new Polynomial(coefficients);
  const derivative = polynomial.derivate().toTree();
  const texs = derivative.toAllValidTexs();
  console.log(texs);
  return texs.includes(ans);
};

export const secondDegreeDerivative: MathExercise<Identifiers> = {
  id: "secondDegreeDerivative",
  connector: "=",
  label: "Dérivée d'un polynôme de degré 2",
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
  generator: (nb: number) =>
    getDistinctQuestions(getSecondDegreeDerivative, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions: getSecondDegreeDerivativePropositions,
  isAnswerValid: isSecondDegreeDerivativeAnswerValid,
};
