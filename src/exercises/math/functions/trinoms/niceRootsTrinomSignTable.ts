import {
  Exercise,
  Question,
  QuestionGenerator,
  SVGSignTableVEA,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { MathLatexConstructor } from "#root/math/mathLatex";
import {
  FunctionSignVariations,
  VariationConstructor,
  functionVariationsEquals,
} from "#root/math/polynomials/functionSignVariations";
import { Trinom, TrinomConstructor } from "#root/math/polynomials/trinom";

type Identifiers = {};

const getNiceRootsTrinomSignTableQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const trinome = TrinomConstructor.randomNiceRoots();

  const corretAns = getCorrectAnswer(trinome);

  const start = MathLatexConstructor("-\\infty", -Infinity);
  const end = MathLatexConstructor("\\infty", Infinity);

  const question: Question<Identifiers> = {
    svgSignTableAnswer: corretAns,
    svgSignTableOptions: {
      start,
      end,
    },
    instruction: `Soit la fonction $f(x)=${trinome.toTex()}$, Dresser le tableau de signe de cette fonction.`,
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

function getCorrectAnswer(trinom: Trinom) {
  const roots = trinom.getRoots().sort((a, b) => a - b);
  const start = MathLatexConstructor("-\\infty", -Infinity);
  const end = MathLatexConstructor("\\infty", Infinity);
  const startSign = trinom.a > 0 ? "+" : "-";
  const variations = [
    VariationConstructor(
      MathLatexConstructor(roots[0] + "", roots[0]),
      startSign === "+" ? "-" : "+",
    ),
    VariationConstructor(
      MathLatexConstructor(roots[1] + "", roots[1]),
      startSign,
    ),
  ];
  return FunctionSignVariations(start, startSign, end, variations);
}
export const niceRootsTrinomSignTable: Exercise<Identifiers> = {
  id: "niceRootsTrinomSignTable",
  label: "Tableau de signe de fonction trinome avec 2 racines",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Fonctions"],
  generator: (nb: number) =>
    getDistinctQuestions(getNiceRootsTrinomSignTableQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  answerType: "SVG",
  isSvgSignTableAnswerValid,
  subject: "Mathématiques",
};
