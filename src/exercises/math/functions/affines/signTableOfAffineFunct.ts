import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  SVGSignTableVEA,
  VEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Affine, AffineConstructor } from "#root/math/polynomials/affine";
import {
  FunctionSignVariations,
  Variation,
  functionVariationsEquals,
} from "#root/math/polynomials/functionSignVariations";
import { randint } from "#root/math/utils/random/randint";

type Identifiers = {};

const getSignTableOfAffineFunctQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const a = randint(-10, 11, [0]);
  const b = a * randint(1, 5);
  const affine = new Affine(a, b, "x");

  const correctAnswer = getCorrectAnswer(affine);
  const question: Question<Identifiers> = {
    svgSignTableAnswer: JSON.stringify(correctAnswer),
    svgSignTableOptions: {
      start: "-\\infty",
      end: "\\infty",
    },
    instruction: `Soit la fonction affine $f(x)=${affine.toTex()}$, Dresser le tableau de signe de cette fonction.`,
    keys: [],
    answerFormat: "raw",
    identifiers: {},
  };

  return question;
};

const isSvgSignTableAnswerValid: SVGSignTableVEA<Identifiers> = (
  ans,
  { svgSignTableAnswer },
) => {
  return functionVariationsEquals(ans, svgSignTableAnswer);
};

const getCorrectAnswer = (affine: Affine): FunctionSignVariations => {
  const a = affine.a;
  const b = affine.b;
  const zero = -b / a;
  const startSign = a < 0 ? "+" : "-";
  const variations: Variation[] = [
    {
      changePoint: { latexValue: zero + "", mathValue: zero },
      sign: startSign === "+" ? "-" : "+",
    },
  ];
  return {
    start: { latexValue: "-\\infty", mathValue: -Infinity },
    startSign,
    end: { latexValue: "\\infty", mathValue: Infinity },
    variations,
  };
};

export const signTableOfAffineFunct: Exercise<Identifiers> = {
  id: "signTableOfAffineFunct",
  label: "Dresser le tableau de signe d'une fonction",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getSignTableOfAffineFunctQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  answerType: "SVG",
  isSvgSignTableAnswerValid,
  subject: "Mathématiques",
};
