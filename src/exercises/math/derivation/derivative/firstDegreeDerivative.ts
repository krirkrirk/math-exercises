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
  a: number;
  b: number;
};

export const getFirstDegreeDerivative: QuestionGenerator<Identifiers> = () => {
  const [a, b] = [randint(-9, 10, [0]), randint(-9, 10)];
  const polynomial = new Polynomial([b, a]);
  const answer = a + "";
  const question: Question<Identifiers> = {
    instruction: `Déterminer la fonction dérivée $f'$ de la fonction $f$ définie par $f(x) = ${polynomial.toTex()}$.`,
    startStatement: `f'(x)`,
    answer,
    keys: ["x"],
    answerFormat: "tex",
    identifiers: { a, b },
  };

  return question;
};

export const getFirstDegreeDerivativePropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, a, b },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  tryToAddWrongProp(propositions, new Polynomial([0, a]).toTree().toTex());
  tryToAddWrongProp(propositions, "x");
  tryToAddWrongProp(propositions, b + "");

  while (propositions.length < n) {
    const wrongAnswer = randint(-9, 10);

    tryToAddWrongProp(propositions, wrongAnswer + "");
  }

  return shuffleProps(propositions, n);
};
export const isFirstDegreeDerivativeAnswerValid: VEA<Identifiers> = (
  ans,
  { answer },
) => {
  return ans === answer;
};

export const firstDegreeDerivative: Exercise<Identifiers> = {
  id: "firstDegreeDerivative",
  connector: "=",
  label: "Dérivée d'une fonction affine",
  levels: ["1reESM", "1reSpé", "1reTech", "MathComp", "1rePro", "TermPro"],
  sections: ["Dérivation"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getFirstDegreeDerivative, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions: getFirstDegreeDerivativePropositions,
  isAnswerValid: isFirstDegreeDerivativeAnswerValid,
  subject: "Mathématiques",
};
