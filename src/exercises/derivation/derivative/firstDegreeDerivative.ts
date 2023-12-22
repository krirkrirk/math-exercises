import {
  MathExercise,
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
type QCMProps = {
  answer: string;
  a: number;
  b: number;
};
type VEAProps = {
  answer: string;
};
export const getFirstDegreeDerivative: QuestionGenerator<
  QCMProps,
  VEAProps
> = () => {
  const [a, b] = [randint(-9, 10, [0]), randint(-9, 10)];
  const polynomial = new Polynomial([b, a]);
  const answer = a + "";
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Déterminer la fonction dérivée $f'$ de la fonction $f$ définie par $f(x) = ${polynomial.toString()}$.`,
    startStatement: `f'(x)`,
    answer,
    keys: ["x"],
    answerFormat: "tex",
    qcmGeneratorProps: { answer, a, b },
  };

  return question;
};

export const getFirstDegreeDerivativePropositions: QCMGenerator<QCMProps> = (
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
export const isFirstDegreeDerivativeAnswerValid: VEA<VEAProps> = (
  ans,
  { answer },
) => {
  return ans === answer;
};

export const firstDegreeDerivative: MathExercise<QCMProps, VEAProps> = {
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
};
