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
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { randint } from "#root/math/utils/random/randint";
import { random } from "#root/utils/random";

type Identifiers = {};

const getOhmicConductorOrGeneratorQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const exo = generateExercise();

  const question: Question<Identifiers> = {
    answer: exo.answer,
    instruction: exo.instruction,

    ggbOptions: exo.ggb.getOptions({
      coords: [8, 40, -5, 30],
    }),
    keys: [],
    hint: exo.hint,
    correction: exo.correction,
    answerFormat: "raw",
    identifiers: {},
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");
  tryToAddWrongProp(propositions, "Conducteur ohmique", "raw");
  tryToAddWrongProp(propositions, "Générateur", "raw");
  tryToAddWrongProp(propositions, "On ne peut pas savoir", "raw");
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

const generateExercise = () => {
  const type = random(["Conducteur ohmique", "Générateur"]);
  const ggb = getGgb(type);
  const instruction = `Après avoir relevé l'intensité du courant circulant dans un dipôle pour différentes tensions entre ses bornes, Nous avons obetnu le graphique ci-dessous.
  
  La dipôle est-elle est un générateur ou un conducteur ohmique ?`;
  const hint = getHint(type);
  const correction = getCorrection(type);
  return {
    instruction,
    ggb,
    answer: type,
    hint,
    correction,
  };
};

const getGgb = (type: string) => {
  const points = [];
  for (let x = 22; x < 33; x += 2) {
    const y =
      type === "Générateur"
        ? Math.pow(10, 15) / Math.pow(x, 10)
        : 0.00000001 * Math.pow(x, 6);
    points.push(`Point({${x},${y}})`);
  }
  return type === "Générateur"
    ? new GeogebraConstructor({
        commands: [
          `Function(${Math.pow(10, 15)}/x^10,1,${randint(40, 51)})`,
        ].concat(points),
        xAxis: { label: "$\\tiny I(A)$" },
        yAxis: { label: "$\\tiny U(V)$" },
      })
    : new GeogebraConstructor({
        commands: [`Function(0.00000001*x^6,1,${randint(40, 51)})`].concat(
          points,
        ),
        xAxis: { label: "$\\tiny I(A)$" },
        yAxis: { label: "$\\tiny U(V)$" },
      });
};

const getHint = (type: string) => {
  return type === "Générateur"
    ? `Rappel : la tension $U$ aux bornes du générateur peut être exprimée par la relation $U=E-r \\cdot I$.`
    : `Rappel de la loi d'ohm : $U=R \\cdot I$.`;
};

const getCorrection = (type: string) => {
  switch (type) {
    case "Générateur":
      return `Selon la relation qui exprime la tension $U$ aux bornes du générateur, $U = E-r \\cdot I$,\n
on en déduit que plus l'intensité $I$ augmente, plus la tension $U$ aux bornes du générateur diminue, ce qui correspond bien au graphique montré.
`;
    case "Conducteur ohmique":
      return `Selon la loi d'ohm qui exprime la tension $U$ aux bornes du conducteur ohmique, $U = R \\cdot I$,\n
on en déduit que plus l'intensité $I$ augmente, plus la tension $U$ aux bornes du conducteur ohmique augmente, ce qui correspond bien au graphique montré.`;
  }
};

export const ohmicConductorOrGenerator: Exercise<Identifiers> = {
  id: "ohmicConductorOrGenerator",
  label: "Comparaisons des graphiques de tension de dipôle",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Électricité"],
  generator: (nb: number) =>
    getDistinctQuestions(getOhmicConductorOrGeneratorQuestion, nb, 10),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  answerType: "QCU",
  maxAllowedQuestions: 10,
  subject: "Physique",
  hasHintAndCorrection: true,
};
