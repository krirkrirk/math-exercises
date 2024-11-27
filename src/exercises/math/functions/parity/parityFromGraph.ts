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
import { randomColor } from "#root/geogebra/colors";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { Affine, AffineConstructor } from "#root/math/polynomials/affine";
import { Polynomial } from "#root/math/polynomials/polynomial";
import { RationalFrac } from "#root/math/polynomials/rationalFrac";
import { Trinom, TrinomConstructor } from "#root/math/polynomials/trinom";
import { randint } from "#root/math/utils/random/randint";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { doWhile } from "#root/utils/doWhile";
import { probaFlip } from "#root/utils/alea/probaFlip";
import { probaLawFlip } from "#root/utils/alea/probaLawFlip";

type Identifiers = {
  type: string;
  fctCmd: string;
};

const getParityFromGraphQuestion: QuestionGenerator<Identifiers> = () => {
  //paires : ax^2 + b   , frac ratio trinom/tirnom
  //impaires : linéaires, ax^3, linéaire/trinom

  // ni l'un ni l'autre : affines, trinomes avec ax, x^3 + b

  const type = probaLawFlip<"even" | "uneven" | "neither">([
    ["even", 0.33],
    ["uneven", 0.33],
    ["neither", 0.33],
  ]);
  let fct: string;
  let answer = "";
  switch (type) {
    case "even":
      if (coinFlip()) {
        fct = new Trinom(randint(-9, 10, [0]), 0, randint(-9, 10))
          .toTree()
          .toMathString();
      } else {
        let num = new Trinom(randint(-9, 10, [0]), 0, randint(-9, 10));
        let denum = doWhile(
          () => new Trinom(randint(-9, 10, [0]), 0, randint(-9, 10)),
          (P) => (num.c === 0 ? P.c !== 0 : P.a / num.a === P.c / num.c),
        );
        fct = new RationalFrac(num, denum).toTree().toMathString();
      }
      answer = "Paire";
      break;
    case "uneven":
      if (probaFlip(0.33)) {
        fct = new Affine(randint(-10, 11, [0]), 0).toTree().toMathString();
      } else {
        if (coinFlip()) {
          fct = new Polynomial([0, randint(-10, 11), 0, randint(-10, 11, [0])])
            .toTree()
            .toMathString();
        } else {
          let num = new Affine(randint(-9, 10, [0]), 0);
          let denum = new Trinom(randint(-9, 10, [0]), 0, randint(-9, 10, [0]));
          fct = new RationalFrac(num, denum).toTree().toMathString();
        }
      }
      answer = "Impaire";
      break;
    case "neither":
      if (probaFlip(0.33)) {
        fct = new Affine(randint(-9, 10, [0]), randint(-9, 10, [0]))
          .toTree()
          .toMathString();
      } else {
        if (coinFlip()) {
          fct = new Trinom(
            randint(-9, 10, [0]),
            randint(-9, 10, [0]),
            randint(-9, 10),
          )
            .toTree()
            .toMathString();
        } else {
          fct = new Polynomial([
            randint(-9, 10),
            randint(-9, 10),
            randint(-9, 10, [0]),
            randint(-9, 10, [0]),
          ])
            .toTree()
            .toMathString();
        }
      }
      answer = "Ni paire, ni impaire";
      break;
  }
  const commands = [`f(x) = ${fct}`, `SetColor(f, "${randomColor()}")`];
  const ggb = new GeogebraConstructor({
    commands,
    lockedAxesRatio: false,
  });
  const question: Question<Identifiers> = {
    answer,
    instruction: `La fonction $f$ représentée ci-dessous est-elle paire, impaire, ou ni paire ni impaire ?`,
    keys: [],
    ggbOptions: ggb.getOptions({
      coords: [-10, 10, -10, 10],
    }),
    answerFormat: "tex",
    identifiers: { type, fctCmd: fct },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");
  tryToAddWrongProp(propositions, "Paire", "raw");
  tryToAddWrongProp(propositions, "Impaire", "raw");
  tryToAddWrongProp(propositions, "Ni paire, ni impaire", "raw");
  tryToAddWrongProp(propositions, "On ne peut pas savoir", "raw");

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const parityFromGraph: Exercise<Identifiers> = {
  id: "parityFromGraph",
  label: "Reconnaître graphiquement la parité d'une fonction",
  levels: ["2nde", "1reSpé"],
  isSingleStep: true,
  sections: ["Fonctions"],
  generator: (nb: number) =>
    getDistinctQuestions(getParityFromGraphQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  answerType: "QCU",
  hasGeogebra: true,
  subject: "Mathématiques",
};
