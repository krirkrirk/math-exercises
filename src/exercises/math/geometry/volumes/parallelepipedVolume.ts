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
    `Polygon(A, B, F, E)`, // Side 1
    `SetColor(Polygon(A, B, F, E), "#F78D04")`, // Color for side 1
    `Polygon(B, C, G, F)`, // Side 2
    `SetColor(Polygon(B, C, G, F), "#F78D04")`, // Color for side 2
    `Polygon(C, D, H, G)`, // Side 3
    `SetColor(Polygon(C, D, H, G), "#F78D04")`, // Color for side 3
    `Polygon(D, A, E, H)`, // Side 4
    `SetColor(Polygon(D, A, E, H), "#F78D04")`, // Color for side 4
    `Polygon(A, B, C, D)`, // Base
    `SetColor(Polygon(A, B, C, D), "#F78D04")`, // Color for base
    `Polygon(E, F, G, H)`, // Top
    `SetColor(Polygon(E, F, G, H), "#F78D04")`, // Color for top
    ...points.map((point) => `SetColor(${point}, "#376FDE")`), // Color for points
    `SetColor(Text(A), "#0045AB")`, // Color for labels
    `SetColor(Text(B), "#0045AB")`,
    `SetColor(Text(C), "#0045AB")`,
    `SetColor(Text(D), "#0045AB")`,
    `SetColor(Text(E), "#0045AB")`,
    `SetColor(Text(F), "#0045AB")`,
    `SetColor(Text(G), "#0045AB")`,
    `SetColor(Text(H), "#0045AB")`,
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
