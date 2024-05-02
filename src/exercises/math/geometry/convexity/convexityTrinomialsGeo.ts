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

type Identifiers = {};

const getConvexityTrinomialsGeoQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const trinom = TrinomConstructor.random();

  const firstDerivative = trinom.derivate();
  const firstdcoeffs = firstDerivative.coefficients;
  const criticalX = -firstdcoeffs[0] / firstdcoeffs[1];
  const criticalY = trinom.calculate(criticalX);

  const instruction = `Soit la fonction $f(x) = ${trinom.toTex()}$. Est-elle :`;

  const commands = [
    `f(x) = ${trinom.toString()}`,
    `SetColor(f, "${blueMain}")`,
    `SetCaption(f, "$\\mathcal C_f$")`,
    `ShowLabel(f, true)`,
    `Critical = (${criticalX},${criticalY})`,
    "SetFixed(Critical, true)",
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
    identifiers: {},
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
  label: "Convexité des fonctions quadratiques (GeoGebra)",
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
