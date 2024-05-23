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
  Rational,
  RationalConstructor,
} from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { isNumberNode } from "#root/tree/nodes/numbers/numberNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { random } from "#root/utils/random";

type Identifiers = {
  h: number;
  baseOfPyramid: Polygon;
};

type ExerciseVars = {
  ggbCommands: string[];
  h: number;
  baseOfPyramid: Polygon;
};

type Polygon = {
  type: string;
  sideSizes: number[];
};

const polygonTypes = ["Square", "Rectangular"];

const getVolumeOfPyramidWithSquareOrRectBaseQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const exercise = generateExercise();
  const baseOfPyramid = exercise.baseOfPyramid;
  const commands = exercise.ggbCommands;
  const ggb = new GeogebraConstructor(commands, {
    hideAxes: true,
    hideGrid: true,
    is3d: true,
  });
  const h = exercise.h;

  const instruction = `Soit une pyramide à base ${getPolygonNameInFr(
    baseOfPyramid.type,
  )} de hauteur $${h}$. Calculer son volume en sachant que : ${
    baseOfPyramid.type === "Square"
      ? `$AB=${baseOfPyramid.sideSizes[0]}$`
      : `$AB=${baseOfPyramid.sideSizes[0]}$ et $BC=${baseOfPyramid.sideSizes[1]}$`
  }.`;

  const volume = calculateVolume(baseOfPyramid.sideSizes, h).simplify();
  const maxCoord = Math.max(
    baseOfPyramid.sideSizes[0],
    baseOfPyramid.sideSizes[1],
  );

  const question: Question<Identifiers> = {
    answer: volume.toTex(),
    instruction: instruction,
    keys: [],
    answerFormat: "tex",
    commands: ggb.commands,
    coords: [-2, maxCoord + 1, -2, maxCoord + 1, -2, exercise.h + 1],
    options: ggb.getOptions(),
    identifiers: { h, baseOfPyramid },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, h, baseOfPyramid },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  generatePropositions(baseOfPyramid, h).forEach((value) =>
    tryToAddWrongProp(propositions, value),
  );
  const volume = calculateVolume(baseOfPyramid.sideSizes, h).simplify();
  let random;
  while (propositions.length < n) {
    random = isNumberNode(volume)
      ? randint(volume.value - 5, volume.value + 5, [volume.value]).toTree()
      : RationalConstructor.randomIrreductible();
    tryToAddWrongProp(propositions, random.toTex());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { baseOfPyramid, h }) => {
  const volume = calculateVolume(baseOfPyramid.sideSizes, h);
  return volume.simplify().toAllValidTexs().includes(ans);
};

const generatePropositions = (baseOfPyramid: Polygon, h: number): string[] => {
  const firstProposition =
    h * baseOfPyramid.sideSizes[0] * baseOfPyramid.sideSizes[1] + "";
  const secondProposition = new FractionNode(
    (
      (baseOfPyramid.sideSizes[0] + baseOfPyramid.sideSizes[1]) *
      2 *
      h
    ).toTree(),
    (3).toTree(),
  )
    .simplify()
    .toTex();
  return [firstProposition, secondProposition];
};

const generateExercise = (): ExerciseVars => {
  const h = randint(1, 11);
  const polygonType = random(polygonTypes);
  const base = generatePolygonWithGgbCmnds(polygonType);
  const ggbCommands = base.commands.concat([
    `H=Point({${base.sideSizes[0] / 2},${base.sideSizes[1] / 2},${h}})`,
    `SetFixed(H,true)`,
    `ShowLabel(H,true)`,
    `Pyra=Pyramid(Poly,H)`,
  ]);
  return {
    ggbCommands,
    h,
    baseOfPyramid: { sideSizes: base.sideSizes, type: polygonType },
  };
};

const calculateVolume = (baseOfPyramidSides: number[], h: number) => {
  return new MultiplyNode(
    new FractionNode((1).toTree(), (3).toTree()),
    (baseOfPyramidSides[0] * baseOfPyramidSides[1] * h).toTree(),
  );
};

const generatePolygonWithGgbCmnds = (polygonType: string) => {
  let sideOne = 0;
  let sideTwo = 0;
  switch (polygonType) {
    case "Square":
      const randomSide = randint(1, 10);
      sideOne = randomSide;
      sideTwo = randomSide;
      break;
    case "Rectangular":
      sideOne = randint(1, 11);
      sideTwo = randint(1, 11, [sideOne]);
      break;
  }
  return {
    commands: [
      `A=Point({0,0,0})`,
      `B=Point({${sideOne},0,0})`,
      `C=Point({${sideOne},${sideTwo},0})`,
      `D=Point({0,${sideTwo},0})`,
      `ShowLabel(A,true)`,
      `ShowLabel(B,true)`,
      `ShowLabel(C,true)`,
      `ShowLabel(D,true)`,
      `SetFixed(A,true)`,
      `SetFixed(B,true)`,
      `SetFixed(C,true)`,
      `SetFixed(D,true)`,
      `Poly=Polygon(A,B,C,D)`,
    ],
    sideSizes: [sideOne, sideTwo],
  };
};

const getPolygonNameInFr = (polygonType: string): string => {
  switch (polygonType) {
    case "Square":
      return "carré";
    case "Rectangular":
      return "rectangulaire";
    default:
      return "";
  }
};
export const volumeOfPyramidWithSquareOrRectBase: Exercise<Identifiers> = {
  id: "volumeOfPyramidWithSquareOrRectBase",
  label: "Caclul de volume d'une pyramide à base carré ou rectangulaire",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Géométrie cartésienne"],
  generator: (nb: number) =>
    getDistinctQuestions(getVolumeOfPyramidWithSquareOrRectBaseQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  hasGeogebra: true,
  is3d: true,
  subject: "Mathématiques",
};
