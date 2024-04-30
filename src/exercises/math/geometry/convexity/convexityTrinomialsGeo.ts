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
import { blueMain, orange } from "#root/geogebra/colors";
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
  const firstdderivative = trinom.derivate();
  const critical = new FractionNode(
    new MultiplyNode(
      new NumberNode(-1),
      firstdderivative.coefficients[0].toTree(),
    ),
    firstdderivative.coefficients[1].toTree(),
  ).simplify();

  const instruction = `Ci-dessous sont tracées la courbe $\\mathcal C_f$ de la fonction $f$.`;
  const commands = [
    `f(x) = ${trinom.toString()}`,
    `SetColor(f, "${blueMain}")`,
    `SetCaption(f, "$\\mathcal C_f$")`,
    `Point Critique = (0,${critical.toTex()})`,
    `ShowLabel(f, true)`,
  ];

  const xMin = Math.min(xA, xB);
  const yMin = Math.min(yA, yB);
  const xMax = Math.max(xA, xB);
  const yMax = Math.max(yA, yB);

  const ggb = new GeogebraConstructor(commands, {
    isGridSimple: true,
  });
  const isConvex = trinom.a > 0 ? "Convexe" : "Concave";

  const question: Question<Identifiers> = {
    answer: isConvex,
    instruction: `Soit la fonction $f(x) = ${trinom.toTex()}$. Est-elle :`,
    commands: ggb.commands,
    coords: ggb.getAdaptedCoords({ xMax, xMin, yMax, yMin }),
    options: ggb.getOptions,
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
  throw Error("VEA not implemented");
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
