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
import { Affine, AffineConstructor } from "#root/math/polynomials/affine";
import { randint } from "#root/math/utils/random/randint";
import { coinFlip } from "#root/utils/coinFlip";

type Identifiers = {
  a: number;
  b: number;
  isAskingA: boolean;
};

type ExerciseType = {
  instruction: string;
  correctAnwer: string;
  f: Affine;
};

const getLeadingCoeffAndOriginOrdinateQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const exercise = generateExercise();
  const isAskingA = +exercise.correctAnwer === exercise.f.a ? true : false;

  const question: Question<Identifiers> = {
    answer: exercise.correctAnwer,
    instruction: exercise.instruction,
    keys: [],
    answerFormat: "tex",
    identifiers: { a: exercise.f.a, b: exercise.f.b, isAskingA },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, a, b, isAskingA },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, isAskingA ? b + "" : a + "");
  let random: number;
  let flip: boolean;
  while (propositions.length < n) {
    flip = coinFlip();
    random = flip ? randint(a - 5, a + 6, [a]) : randint(b - 5, b + 6, [b]);
    tryToAddWrongProp(propositions, random + "");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

const generateExercise = (): ExerciseType => {
  const flip = coinFlip();
  const f = AffineConstructor.random();
  const instruction = `Soit la fonction affine $f=${f.toTex()}$, ${
    flip
      ? `Déterminer la valeur du coefficient directeur`
      : `Déterminer la valeur de l'ordonnée à l'origine.`
  }`;
  return {
    instruction,
    correctAnwer: flip ? f.a + "" : f.b + "",
    f,
  };
};
export const leadingCoeffAndOriginOrdinate: Exercise<Identifiers> = {
  id: "leadingCoeffAndOriginOrdinate",
  label:
    "A partir de l'expression algébrique d'une fonction affine, déterminer la valeur du coefficient directeur ou de l'ordonnée à l'origine.",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Fonctions affines"],
  generator: (nb: number) =>
    getDistinctQuestions(getLeadingCoeffAndOriginOrdinateQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
