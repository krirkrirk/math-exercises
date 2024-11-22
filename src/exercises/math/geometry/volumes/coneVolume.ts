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
import { numberParser } from "#root/tree/parsers/numberParser";

type Identifiers = {
  radius: number;
  height: number;
};

const getConeVolumeQuestion: QuestionGenerator<Identifiers> = () => {
  let radius, height;

  do {
    radius = randint(1, 11);
    height = randint(2, 12);
  } while (height <= radius);

  const volume = round((1 / 3) * Math.PI * Math.pow(radius, 2) * height, 2)
    .toTree()
    .toTex();

  const xMin = -radius - 5;
  const xMax = radius + 5;
  const yMin = -radius - 5;
  const yMax = radius + 5;
  const zMax = height + 5;

  const commands = [
    `A = (0, 0, 0)`,
    `B = (0, 0, ${height})`,
    `SetFixed(A, true)`,
    `SetFixed(B, true)`,
    `SetVisibleInView(A, -1, false)`,
    `SetVisibleInView(B, -1, false)`,
    `Cone(A, B, ${radius})`,
  ];

  const ggb = new GeogebraConstructor({
    commands,
    lockedAxesRatio: false,
    hideAxes: true,
    hideGrid: true,
    is3D: true,
  });

  const question: Question<Identifiers> = {
    answer: volume,
    instruction: `Le cône ci-dessous a une base de rayon $${radius}$ et une hauteur de $${height}$. Calculer son volume (arrondir au centième).`,
    ggbOptions: ggb.getOptions({
      coords: [xMin, xMax, yMin, yMax, 0, zMax],
    }),
    keys: [],
    answerFormat: "tex",
    identifiers: { radius, height },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, radius, height },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const wrongVolume1 = round(Math.PI * Math.pow(radius, 2) * height, 2)
    .toTree()
    .toTex();
  tryToAddWrongProp(propositions, wrongVolume1);

  const wrongVolume2 = round((1 / 3) * Math.PI * radius * height, 2)
    .toTree()
    .toTex();
  tryToAddWrongProp(propositions, wrongVolume2);

  const wrongVolume3 = round(3 * Math.PI * Math.pow(radius, 2) * height, 2)
    .toTree()
    .toTex();
  tryToAddWrongProp(propositions, wrongVolume3);

  while (propositions.length < n) {
    let wrongRadius, wrongHeight;

    do {
      wrongRadius = randint(1, 5);
      wrongHeight = randint(2, 10);
    } while (wrongHeight <= wrongRadius);

    const wrongVolume = round(
      (1 / 3) * Math.PI * Math.pow(wrongRadius, 2) * wrongHeight,
      2,
    )
      .toTree()
      .toTex();
    tryToAddWrongProp(propositions, wrongVolume);
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, radius, height }) => {
  const parsed = numberParser(ans);
  if (!parsed) return false;
  return parsed === answer;
};

export const coneVolume: Exercise<Identifiers> = {
  id: "coneVolume",
  label: "Calculer le volume d'un cône",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Géométrie euclidienne"],
  generator: (nb: number) => getDistinctQuestions(getConeVolumeQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  hasGeogebra: true,
  subject: "Mathématiques",
};
