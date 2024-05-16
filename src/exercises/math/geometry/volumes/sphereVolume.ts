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
import { randint } from "#root/math/utils/random/randint";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { round } from "#root/math/utils/round";

type Identifiers = {
  radius: number;
};

const getSphereVolumeQuestion: QuestionGenerator<Identifiers> = () => {
  const radius = randint(10, 110) / 10;

  const volume = round((4 / 3) * Math.PI * Math.pow(radius, 3), 2)
    .toTree()
    .toTex();

  const xMin = -radius - 5;
  const xMax = radius + 5;
  const yMin = -radius - 5;
  const yMax = radius + 5;
  const zMax = radius + 5;
  const zMin = -radius - 5;

  const commands = [
    `A = (0, 0, 0)`,
    `Sphere(A, ${radius})`,
    `SetFixed(A, true)`,
  ];

  const ggb = new GeogebraConstructor(commands, {
    isGridSimple: true,
    isAxesRatioFixed: false,
    is3D: true,
  });

  const question: Question<Identifiers> = {
    answer: volume,
    instruction: `Calculez le volume d'une sphère avec un rayon de $${radius}$ cm. La figure ci-dessous représente la sphère.`,
    commands: ggb.commands,
    coords: [xMin, xMax, yMin, yMax, zMin, zMax],
    options: ggb.getOptions(),
    keys: [],
    answerFormat: "tex",
    identifiers: { radius },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, radius }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const wrongVolume1 = round(Math.PI * Math.pow(radius, 2) * radius, 2)
    .toTree()
    .toTex();
  tryToAddWrongProp(propositions, wrongVolume1);

  const wrongVolume2 = round((4 / 3) * Math.PI * radius * 3, 2)
    .toTree()
    .toTex();
  tryToAddWrongProp(propositions, wrongVolume2);

  const wrongVolume3 = round((1 / 3) * Math.PI * Math.pow(radius, 3), 2)
    .toTree()
    .toTex();
  tryToAddWrongProp(propositions, wrongVolume3);

  while (propositions.length < n) {
    const wrongRadius = radius + 1;
    const wrongVolume = round((4 / 3) * Math.PI * Math.pow(wrongRadius, 3), 2)
      .toTree()
      .toTex();
    tryToAddWrongProp(propositions, wrongVolume);
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, radius }) => {
  const validanswer = round(
    (4 / 3) * Math.PI * Math.pow(radius, 3),
    2,
  ).toTree();
  const latexs = validanswer.toAllValidTexs();

  return latexs.includes(ans);
};

export const sphereVolume: Exercise<Identifiers> = {
  id: "sphereVolume",
  label: "Calculer le volume d'une sphère",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Géométrie euclidienne"],
  generator: (nb: number) => getDistinctQuestions(getSphereVolumeQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
