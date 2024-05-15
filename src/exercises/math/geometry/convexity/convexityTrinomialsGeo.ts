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
import { blueMain } from "#root/geogebra/colors";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { TrinomConstructor } from "#root/math/polynomials/trinom";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";

type Identifiers = {
  trinom: number[];
};

const getConvexityTrinomialsGeoQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const trinom = TrinomConstructor.random();
  const instruction = `Ci-dessous est tracée la courbe représentative $\\mathcal C_f$ d'une fonction $f$. Sur $\\mathbb{R}$, la fonction $f$ est :`;

  const commands = [
    `f(x) = ${trinom.toString()}`,
    `SetColor(f, "${blueMain}")`,
    `SetCaption(f, "$\\mathcal C_f$")`,
    `ShowLabel(f, true)`,
  ];

  const ggb = new GeogebraConstructor(commands, {
    isGridSimple: true,
    isAxesRatioFixed: false,
  });
  const isConvex = trinom.a > 0 ? "Convexe" : "Concave";

  const question: Question<Identifiers> = {
    answer: isConvex,
    instruction,
    commands: ggb.commands,
    coords: trinom.getCoords(),
    options: ggb.getOptions(),
    keys: [],
    answerFormat: "raw",
    identifiers: { trinom: [trinom.a, trinom.b, trinom.c] },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");

  tryToAddWrongProp(propositions, "Concave", "raw");
  tryToAddWrongProp(propositions, "Convexe", "raw");
  tryToAddWrongProp(propositions, "Ni l'un ni l'autre", "raw");
  tryToAddWrongProp(propositions, "On ne peut pas savoir", "raw");
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const convexityTrinomialsGeo: Exercise<Identifiers> = {
  id: "convexityTrinomialsGeo",
  label: "Déterminer graphiquement la convexité d'un trinôme",
  levels: ["TermSpé"],
  isSingleStep: true,
  sections: ["Dérivation"],
  generator: (nb: number) =>
    getDistinctQuestions(getConvexityTrinomialsGeoQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  answerType: "QCM",
  getPropositions,
  isAnswerValid,
  hasGeogebra: true,
  subject: "Mathématiques",
};
