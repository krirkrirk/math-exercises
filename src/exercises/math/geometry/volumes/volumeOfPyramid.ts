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

type ExerciseVars = {
  commands: string[];
  h: number;
  baseOfPyramid: { sideSize: number[]; type: string };
};

const polygonTypes = ["Square", "Triangle", "Rectangular"];

const getVolumeOfPyramidQuestion: QuestionGenerator<Identifiers> = () => {
  const exercise = generateExercise();
  const commands = exercise.commands;
  const baseOfPyramid = exercise.baseOfPyramid;
  const correctAnswer = calculateVolume(
    baseOfPyramid.type,
    baseOfPyramid.sideSize,
    exercise.h,
  );

  const ggb = new GeogebraConstructor(commands, {
    hideAxes: true,
    hideGrid: true,
    is3d: true,
  });

  const question: Question<Identifiers> = {
    answer: correctAnswer + "",
    instruction: `test${randint(1, 100)}`,
    keys: [],
    answerFormat: "tex",
    commands: ggb.commands,
    options: ggb.getOptions(),
    coords: [
      -2,
      baseOfPyramid.sideSize[0] + 1,
      -2,
      baseOfPyramid.sideSize[1] + 1,
      -2,
      exercise.h + 1,
    ],
    identifiers: {},
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

const generateExercise = (): ExerciseVars => {
  const h = randint(1, 11);
  const polygonType = random(polygonTypes);
  const base = generatePolygonWithGgbCmnds(polygonType);
  const commands = base.commands.concat([`Pyra=Pyramid(Poly,${h})`]);
  return {
    commands,
    h,
    baseOfPyramid: { sideSize: base.sideSize, type: polygonType },
  };
};

const calculateVolume = (
  baseType: string,
  sideSize: number[],
  h: number,
): number => {
  switch (baseType) {
    case "Square":
      return (1 / 3) * Math.pow(sideSize[0], 2) * h;
    case "Rectangular":
      return (1 / 3) * (sideSize[0] * sideSize[1]) * h;
    case "Triangle":
      return (1 / 3) * ((sideSize[1] * sideSize[0] * 1) / 2);
    default:
      return 0;
  }
};

const generatePolygonWithGgbCmnds = (
  polygonType: string,
): { commands: string[]; sideSize: number[] } => {
  switch (polygonType) {
    case "Square":
      const squareSide = randint(1, 10);
      return {
        commands: [
          `A=Point({0,0,0})`,
          `B=Point({${squareSide},0,0})`,
          `C=Point({${squareSide},${squareSide},0})`,
          `D=Point({0,${squareSide},0})`,
          `Poly=Polygon(A,B,C,D)`,
        ],
        sideSize: [squareSide, squareSide],
      };
    case "Triangle":
      const ABSide = randint(1, 10);
      const ACSide = randint(1, 10);
      return {
        commands: [
          `A=Point({0,0,0})`,
          `B=Point({${ABSide},0,0})`,
          `C=Point({0,${ACSide},0})`,
          `Poly=Polygon(A,B,C)`,
        ],
        sideSize: [ABSide, ACSide],
      };
    case "Rectangular":
      const sideOne = randint(1, 10);
      const sideTwo = randint(1, 10);
      return {
        commands: [
          `A=Point({0,0,0})`,
          `B=Point({${sideOne},0,0})`,
          `C=Point({${sideOne},${sideTwo},0})`,
          `D=Point({0,${sideTwo},0})`,
          `Poly=Polygon(A,B,C,D)`,
        ],
        sideSize: [sideOne, sideTwo],
      };
    default:
      return { commands: [], sideSize: [] };
  }
};
export const volumeOfPyramid: Exercise<Identifiers> = {
  id: "volumeOfPyramid",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getVolumeOfPyramidQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  hasGeogebra: true,
  is3d: true,
  subject: "Mathématiques",
};
