import {
  Exercise,
  Question,
  QuestionGenerator,
  SVGSignTableVEA,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import {
  FunctionSignVariations,
  FunctionSignVariationsConstructor,
  Variation,
  VariationConstructor,
  functionVariationsEquals,
} from "#root/math/polynomials/functionSignVariations";
import { Trinom, TrinomConstructor } from "#root/math/polynomials/trinom";
import { MathLatexConstructor } from "#root/math/utils/mathLatex";
import { randint } from "#root/math/utils/random/randint";

type Identifiers = {};

const getTrinomSignTableQuestion: QuestionGenerator<Identifiers> = () => {
  const trionm = TrinomConstructor.randomNiceRoots(randint(0, 3));
  const corretAns = getCorrectAnswer(trionm);

  const question: Question<Identifiers> = {
    svgSignTableAnswer: corretAns,
    svgSignTableOptions: {
      start: corretAns.start,
      end: corretAns.end,
    },
    instruction: `Soit la fonction $f(x)=${trionm.toTex()}$, dresser le tableau de signe de cette fonction.`,
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

function getCorrectAnswer(trinom: Trinom): FunctionSignVariations {
  const roots = trinom.getRoots().sort((a, b) => a - b);
  const start = MathLatexConstructor("-\\infty", -Infinity);
  const end = MathLatexConstructor("\\infty", Infinity);
  const startSign = trinom.a > 0 ? "+" : "-";
  let variations: Variation[] = [];
  switch (roots.length) {
    case 1:
      variations = [
        VariationConstructor(
          MathLatexConstructor(roots[0] + "", roots[0]),
          startSign === "+" ? "-" : "+",
        ),
      ];
      break;
    case 2:
      variations = [
        VariationConstructor(
          MathLatexConstructor(roots[0] + "", roots[0]),
          startSign === "+" ? "-" : "+",
        ),
        VariationConstructor(
          MathLatexConstructor(roots[1] + "", roots[1]),
          startSign,
        ),
      ];
      break;
  }
  return FunctionSignVariationsConstructor(start, startSign, end, variations);
}

export const trinomSignTable: Exercise<Identifiers> = {
  id: "trinomSignTable",
  label: "Tableau de signe d'un trinome avec 0,1 ou 2 racines",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Fonctions"],
  generator: (nb: number) =>
    getDistinctQuestions(getTrinomSignTableQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  answerType: "SVG",
  isSvgSignTableAnswerValid,
  subject: "Mathématiques",
};
