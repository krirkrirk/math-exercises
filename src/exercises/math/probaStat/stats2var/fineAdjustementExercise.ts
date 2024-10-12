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
import { randfloat } from "#root/math/utils/random/randfloat";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { coinFlip } from "#root/utils/alea/coinFlip";

type Identifiers = {
  isJustified: boolean;
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

  const ggb = new GeogebraConstructor({
    commands,
    hideAxes: true,
    hideGrid: true,
  });

  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);

  const question: Question<Identifiers> = {
    answer: exercise.correctAnswer,
    instruction: `On considère le nuage de points ci-dessous. Un ajustement affine semble-t-il justifié ? Quelle peut être la valeur du coefficient de détermination ?`,
    ggbOptions: ggb.getOptions({
      coords: ggb.getAdaptedCoords({ xMin, xMax, yMin, yMax }),
    }),
    keys: [],
    answerFormat: "raw",
    identifiers: { isJustified: exercise.isJustified },
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
    randomNb = randfloat(0, 0.5, 2);
    tryToAddWrongProp(
      propositions,
      `Un ajustement affine est justifié. Le coefficient de détermination vaut ${randomNb}`,
    );
  }
  return shuffleProps(propositions, n);
};

const generateProposition = (isJustified: boolean): string[] => {
  let randCoeff = randfloat(0, 0.7, 2);
  let node = new NumberNode(randCoeff);
  const firstProposition = `Un ajustement affine est justifié. Le coefficient de détermination vaut ${node.toTex()}`;
  randCoeff = randfloat(0.9, 1.0, 2);
  node = new NumberNode(randCoeff);
  const secondProposition = `Un ajustement affine n'est pas justifié. Le coefficient de détermination vaut ${node.toTex()}`;
  randCoeff = isJustified ? randfloat(0, 0.7, 2) : randfloat(0.9, 1.0, 2);
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
  const coeff = cloudPoints.getCorrelationCoeff().value;
  let determinationCoeff = new NumberNode(+(coeff * coeff).toFixed(2));
  if (determinationCoeff.value === 0) {
    determinationCoeff = new NumberNode(0.1);
  }
  if (determinationCoeff.value === 1) {
    determinationCoeff = new NumberNode(0.99);
  }
  const correctAnswer =
    determinationCoeff.value >= 0.9
      ? `Un ajustement affine est justifié. Le coefficient de détermination vaut ${determinationCoeff.toTex()}`
      : `Un ajustement affine n'est pas justifié. Le coefficient de détermination vaut ${determinationCoeff.toTex()}`;

  return {
    cloudPoints,
    isJustified: determinationCoeff.value >= 0.9,
    correctAnswer,
  };
};
export const fineAdjustementExercise: Exercise<Identifiers> = {
  id: "fineAdjustementExercise",
  label: "Proposition d'ajustement affine d'un nuage de points",
  levels: ["TermSpé"],
  isSingleStep: true,
  hasGeogebra: true,
  answerType: "QCU",
  sections: ["Statistiques"],
  generator: (nb: number) =>
    getDistinctQuestions(getFineAdjustementExerciseQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
