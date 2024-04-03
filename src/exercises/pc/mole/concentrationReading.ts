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
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";

type Identifiers = {};

const getConcentrationReadingQuestion: QuestionGenerator<Identifiers> = () => {
  const absorbtion = randfloat(0.5, 5);
  const concentration = randfloat(0.1, 2);
  const commands = [
    `L = Line((0,0), (${concentration}, ${absorbtion}))`,
    `SetFixed(L, true)`,
    `SetColor(L, "${randomColor()}")`,
  ];

  const ggb = new GeogebraConstructor(commands, {
    isGridSimple: false,
    isAxesRatioFixed: false,
    axisLabels: ["$\\tiny C (\\text{mol}\\cdot \\text{L}^{-1})$", "$\\tiny A$"],
  });
  const question: Question<Identifiers> = {
    answer: concentration + "",
    instruction: `On trace la courbe d'étalonnage ci-dessous. L'absorbance d'ue solution est $A = ${absorbtion}$. Quelle est la concentration en espèce colorée de cette solution ?`,
    keys: [],
    answerFormat: "tex",
    identifiers: {},
    commands: ggb.commands,
    options: ggb.getOptions(),
    coords: [-1, concentration + 2, -1, absorbtion + 2],
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    throw Error("QCM not implemented");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  throw Error("VEA not implemented");
};
export const concentrationReading: Exercise<Identifiers> = {
  id: "concentrationReading",
  label: "",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getConcentrationReadingQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
