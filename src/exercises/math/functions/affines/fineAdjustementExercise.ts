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
import {
  CloudPoints,
  CloudPointsConstructor,
} from "#root/math/geometry/CloudPoints";
import { Point } from "#root/math/geometry/point";
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { coinFlip } from "#root/utils/coinFlip";
import { random } from "#root/utils/random";

type Identifiers = {
  isJustified: boolean;
  xValues: number[];
  yValues: number[];
};

type ExerciseType = {
  cloudPoints: CloudPoints;
  isJustified: boolean;
  correctAnswer: string;
};

const getFineAdjustementExerciseQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const exercise = generateExercise();
  const cloudPoints = exercise.cloudPoints;

  const xValues = cloudPoints.points.map((element) => {
    return element.getXnumber();
  });
  const yValues = cloudPoints.points.map((element) => {
    return element.getYnumber();
  });
  const commands = cloudPoints.points.map((point) => {
    return `${point.name}=Point({${point.getXnumber()},${point.getYnumber()}})`;
  });
  commands.push(
    ...cloudPoints.points.map((point) => {
      return `SetFixed(${point.name},true)`;
    }),
  );

  const ggb = new GeogebraConstructor(commands, {
    hideGrid: true,
    hideAxes: true,
  });

  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);

  const question: Question<Identifiers> = {
    answer: exercise.correctAnswer,
    instruction: ``,
    commands: ggb.commands,
    coords: ggb.getAdaptedCoords({ xMin, xMax, yMin, yMax }),
    keys: [],
    answerFormat: "raw",
    identifiers: { isJustified: exercise.isJustified, xValues, yValues },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, isJustified },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");
  generateProposition(isJustified).forEach((value) =>
    tryToAddWrongProp(propositions, value, "raw"),
  );
  let randomNb: number;
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(1, 20) + "");
  }
  return shuffleProps(propositions, n);
};

const generateProposition = (isJustified: boolean): string[] => {
  let randCoeff = randfloat(-0.5, 0.5, 2);
  let node = new NumberNode(randCoeff);
  const firstProposition = `Un ajustement affine est justifié. Le coefficient de détermination vaut ${node.toTex()}`;
  randCoeff = randfloat(0.9, 1.0, 2);
  node = new NumberNode(randCoeff);
  const secondProposition = `Un ajustement affine n'est pas justifié. Le coefficient de détermination vaut ${node.toTex()}`;
  randCoeff = isJustified ? randfloat(-0.5, 0.5, 2) : randfloat(0.9, 1.0, 2);
  node = new NumberNode(randCoeff);
  const thirdProposition = `Un ajustement affine ${
    isJustified ? `n'est pas justifié` : `est justifié`
  }. Le coefficient de détermination vaut ${node.toTex()}`;

  return [firstProposition, secondProposition, thirdProposition];
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

const generateExercise = (): ExerciseType => {
  const flip = coinFlip();
  const cloudPoints = flip
    ? CloudPointsConstructor.random(8)
    : CloudPointsConstructor.randomLinear(8);
  const coeff = cloudPoints.getCorrelationCoeff();
  const correctAnswer =
    Math.abs(coeff.value) >= 0.9
      ? `Un ajustement affine est justifié. Le coefficient de détermination vaut ${coeff.toTex()}`
      : `Un ajustement affine n'est pas justifié. Le coefficient de détermination vaut ${coeff.toTex()}`;

  return { cloudPoints, isJustified: !flip, correctAnswer };
};
export const fineAdjustementExercise: Exercise<Identifiers> = {
  id: "fineAdjustementExercise",
  label: "",
  levels: [],
  isSingleStep: true,
  hasGeogebra: true,
  answerType: "QCM",
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getFineAdjustementExerciseQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
