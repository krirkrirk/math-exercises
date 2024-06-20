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
  length: number;
  width: number;
  height: number;
  angle: number;
};

const getParallelepipedVolumeQuestion: QuestionGenerator<Identifiers> = () => {
  const length = randint(10, 110) / 10;
  const width = randint(10, 110) / 10;
  const height = randint(10, 110) / 10;
  const angle = randint(30, 150);

  const angleRad = (angle * Math.PI) / 180;
  const xOffset = height * Math.cos(angleRad);
  const zOffset = height * Math.sin(angleRad);

  const volume = round(length * width * height, 2)
    .toTree()
    .toTex();

  const xMin = -length - 5;
  const xMax = length + xOffset + 5;
  const yMin = -(-5);
  const yMax = width + 5;
  const zMax = height + 5;
  const zMin = -height - 5;

  const points = [`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`];
  const commands = [
    `A = (0, 0, 0)`,
    `B = (${length}, 0, 0)`,
    `C = (${length + xOffset}, ${width}, ${zOffset})`,
    `D = (${xOffset}, ${width}, ${zOffset})`,
    `E = (0, 0, ${height})`,
    `F = (${length}, 0, ${height})`,
    `G = (${length + xOffset}, ${width}, ${height + zOffset})`,
    `H = (${xOffset}, ${width}, ${height + zOffset})`,
    // Base parallelogram
    `Polygon(A, B, C, D)`,
    // Top parallelogram
    `Polygon(E, F, G, H)`,
    // Side faces
    `Polygon(A, B, F, E)`,
    `Polygon(B, C, G, F)`,
    `Polygon(C, D, H, G)`,
    `Polygon(D, A, E, H)`,
  ];

  for (let point of points) {
    commands.push(`SetFixed(${point}, true)`);
  }
  const ggb = new GeogebraConstructor(commands, {
    isGridSimple: true,
    isAxesRatioFixed: false,
    is3D: true,
    hideAxes: true,
    hideGrid: true,
  });

  const question: Question<Identifiers> = {
    answer: volume,
    instruction: `Le parallélépipède $ABCDEFGH$ ci-dessous a une longueur de $${length.frenchify()}$, une largeur de $${width.frenchify()}$, et une hauteur de $${height.frenchify()}$. Calculer son volume (arrondir au centième).`,
    commands: ggb.commands,
    coords: [xMin, xMax, yMin, yMax, zMin, zMax],
    options: ggb.getOptions(),
    keys: [],
    answerFormat: "tex",
    identifiers: { length, width, height, angle },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, length, width, height },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const wrongVolume1 = round(length * width, 2)
    .toTree()
    .toTex();
  tryToAddWrongProp(propositions, wrongVolume1);

  const wrongVolume2 = round(width * height, 2)
    .toTree()
    .toTex();
  tryToAddWrongProp(propositions, wrongVolume2);

  const wrongVolume3 = round(length * height, 2)
    .toTree()
    .toTex();
  tryToAddWrongProp(propositions, wrongVolume3);

  while (propositions.length < n) {
    const wrongLength = length + 1;
    const wrongWidth = width + 1;
    const wrongHeight = height + 1;
    const wrongVolume = round(wrongLength * wrongWidth * wrongHeight, 2)
      .toTree()
      .toTex();
    tryToAddWrongProp(propositions, wrongVolume);
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, length, width, height },
) => {
  const validanswer = round(length * width * height, 2).toTree();
  const latexs = validanswer.toAllValidTexs();

  return latexs.includes(ans);
};

export const parallelepipedVolume: Exercise<Identifiers> = {
  id: "parallelepipedVolume",
  label: "Calculer le volume d'un parallélépipède",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Géométrie euclidienne"],
  generator: (nb: number) =>
    getDistinctQuestions(getParallelepipedVolumeQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
