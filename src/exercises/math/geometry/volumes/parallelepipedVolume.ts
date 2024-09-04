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
import { orange } from "#root/geogebra/colors";

type Identifiers = {
  length: number;
  width: number;
  height: number;
  angle: number;
};

const getParallelepipedVolumeQuestion: QuestionGenerator<Identifiers> = () => {
  const length = randint(50, 110) / 10;
  const width = randint(50, 110) / 10;
  const height = randint(50, 80) / 10;
  const angle = randint(30, 90);

  const angleRad = (angle * Math.PI) / 180;
  const yOffset = height * Math.cos(angleRad);
  const zOffset = height * Math.sin(angleRad);

  const volume = round(length * width * height, 2)
    .toTree()
    .toTex();

  const xMin = -length / 2 - 5;
  const xMax = length / 2 + 5;
  const yMin = -width / 2 - 5;
  const yMax = width / 2 + yOffset + 5;
  const zMax = height + zOffset + 5;
  const zMin = -5;

  const points = [`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`];
  const commands = [
    `A = (${-length / 2}, ${-width / 2}, 0)`,
    `B = (${-length / 2}, ${width / 2}, 0)`,
    `C = (${length / 2}, ${width / 2}, 0)`,
    `D = (${length / 2}, ${-width / 2}, 0)`,
    `E = (${-length / 2}, ${-width / 2 + yOffset}, ${zOffset})`,
    `F = (${-length / 2}, ${width / 2 + yOffset}, ${zOffset})`,
    `G = (${length / 2}, ${width / 2 + yOffset}, ${zOffset})`,
    `H = (${length / 2}, ${-width / 2 + yOffset}, ${zOffset})`,
    `P1 = Polygon(A, B, F, E)`, // Side 1
    `SetColor(P1, "${orange}")`, // Color for side 1
    `P2 = Polygon(B, C, G, F)`, // Side 2
    `SetColor(P2, "${orange}")`, // Color for side 2
    `P3 = Polygon(C, D, H, G)`, // Side 3
    `SetColor(P3, "${orange}")`, // Color for side 3
    `P4 = Polygon(D, A, E, H)`, // Side 4
    `SetColor(P4, "${orange}")`, // Color for side 4
    `P5 = Polygon(A, B, C, D)`, // Base
    `SetColor(P5, "${orange}")`, // Color for base
    `P6 = Polygon(E, F, G, H)`, // Top
    `SetColor(P6, "${orange}")`, // Color for top
    `ShowLabel(A, true)`,
    `ShowLabel(B, true)`,
    `ShowLabel(C, true)`,
    `ShowLabel(D, true)`,
    `ShowLabel(E, true)`,
    `ShowLabel(F, true)`,
    `ShowLabel(G, true)`,
    `ShowLabel(H, true)`,
    `SetFixed(A, true)`,
    `SetFixed(B, true)`,
    `SetFixed(C, true)`,
    `SetFixed(D, true)`,
    `SetFixed(E, true)`,
    `SetFixed(F, true)`,
    `SetFixed(G, true)`,
    `SetFixed(H, true)`,
    `ZoomIn(${xMin}, ${yMin}, ${xMax}, ${yMax}, ${zMin}, ${zMax})`,
  ];

  const ggb = new GeogebraConstructor({
    commands,
    lockedAxesRatio: false,
    is3D: true,
    hideAxes: true,
    hideGrid: true,
  });

  const question: Question<Identifiers> = {
    answer: volume,
    instruction: `Le parallélépipède $ABCDEFGH$ ci-dessous a une longueur de $${length.frenchify()}$, une largeur de $${width.frenchify()}$, et une hauteur de $${height.frenchify()}$. Calculer son volume (arrondir au centième).`,
    ggbOptions: ggb.getOptions({
      coords: [xMin, xMax, yMin, yMax, zMin, zMax],
    }),
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
  hasGeogebra: true,
  subject: "Mathématiques",
};
