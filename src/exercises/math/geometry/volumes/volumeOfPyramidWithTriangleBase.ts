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
import { RationalConstructor } from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { isNumberNode } from "#root/tree/nodes/numbers/numberNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { random } from "#root/utils/random";

type Identifiers = {
  h: number;
  baseOfPyramidSides: number[];
};

type ExerciseVars = {
  ggbCommands: string[];
  h: number;
  baseOfPyramidSides: number[];
  originX: number;
};

const pythagoreTriplet = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [20, 21, 29],
  [12, 35, 37],
  [9, 40, 41],
  [28, 45, 53],
  [11, 60, 61],
  [16, 63, 65],
];

const getVolumeOfPyramidWithTriangleBaseQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const exercise = generateExercise();
  const commands = exercise.ggbCommands;
  const baseOfPyramidSides = exercise.baseOfPyramidSides;
  const volume = calculateVolume(baseOfPyramidSides, exercise.h);

  const ggb = new GeogebraConstructor(commands, {
    hideAxes: true,
    hideGrid: true,
    is3d: true,
  });

  const maxCoord = Math.max(baseOfPyramidSides[0], baseOfPyramidSides[1]);

  const question: Question<Identifiers> = {
    answer: volume.simplify().toTex(),
    instruction: `Soit une pyramide à base triangulaire de hauteur $${exercise.h}$. 
    Cacluler le volume de la pyramide en sachant $AC=${baseOfPyramidSides[0]}, AB=${baseOfPyramidSides[1]}, BC=${baseOfPyramidSides[2]}$`,
    keys: [],
    answerFormat: "tex",
    commands: ggb.commands,
    options: ggb.getOptions(),
    coords: [
      exercise.originX,
      maxCoord + 1,
      -2,
      maxCoord + 1,
      -2,
      exercise.h + 1,
    ],
    identifiers: { h: exercise.h, baseOfPyramidSides },
  };

  return question;
};
const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, baseOfPyramidSides, h },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  generatePropositions(baseOfPyramidSides, h).forEach((value) =>
    tryToAddWrongProp(propositions, value),
  );
  const volume = calculateVolume(baseOfPyramidSides, h).simplify();
  let random;
  while (propositions.length < n) {
    random = isNumberNode(volume)
      ? randint(volume.value - 5, volume.value + 5, [volume.value]).toTree()
      : RationalConstructor.randomIrreductible();
    tryToAddWrongProp(propositions, random.toTex());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { h, baseOfPyramidSides }) => {
  const volume = calculateVolume(baseOfPyramidSides, h);
  return volume
    .simplify()
    .toAllValidTexs({ allowFractionToDecimal: true })
    .includes(ans);
};

const generatePropositions = (
  baseOfPyramidSides: number[],
  h: number,
): string[] => {
  const firstProposition = new FractionNode(
    (
      baseOfPyramidSides[0] +
      baseOfPyramidSides[1] +
      baseOfPyramidSides[2]
    ).toTree(),
    (3).toTree(),
  )
    .simplify()
    .toTex();
  const secondProposition = new FractionNode(
    (baseOfPyramidSides[0] * baseOfPyramidSides[1]).toTree(),
    (2).toTree(),
  )
    .simplify()
    .toTex();

  return [firstProposition, secondProposition];
};

const calculateVolume = (sideSize: number[], h: number): AlgebraicNode => {
  return new FractionNode(
    new MultiplyNode(
      new FractionNode((sideSize[0] * sideSize[1]).toTree(), (2).toTree()),
      h.toTree(),
    ),
    (3).toTree(),
  );
};

const generateExercise = (): ExerciseVars => {
  const h = randint(1, 21, [0]);
  const triangle = generateTriangleWithGGBCommands();
  const ggbCommands = triangle.commands.concat([
    `H=Point({${triangle.sideSizes[0] / 4},${triangle.sideSizes[1] / 4},${h}})`,
    `SetFixed(H,true)`,
    `ShowLabel(H,true)`,
    `Pyra=Pyramid(Poly,H)`,
  ]);

  return {
    ggbCommands,
    h,
    baseOfPyramidSides: triangle.sideSizes,
    originX: triangle.originX,
  };
};

const generateTriangleWithGGBCommands = () => {
  const rectTriangle = random(pythagoreTriplet);
  const ABSide = rectTriangle[0];
  const originX = randint(-ABSide + 1, 0);
  const ACSide = rectTriangle[1];
  const BCSide = rectTriangle[2];
  return {
    commands: [
      `A=Point({${originX},0,0})`,
      `B=Point({${ABSide + originX},0,0})`,
      `C=Point({0,${ACSide},0})`,
      `ShowLabel(A,True)`,
      `ShowLabel(B,True)`,
      `ShowLabel(C,True)`,
      `SetFixed(A,true)`,
      `SetFixed(B,true)`,
      `SetFixed(C,true)`,
      `Poly=Polygon(A,B,C)`,
    ],
    sideSizes: [ABSide, ACSide, BCSide, originX],
    originX,
  };
};
export const volumeOfPyramidWithTriangleBase: Exercise<Identifiers> = {
  id: "volumeOfPyramidWithTriangleBase",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getVolumeOfPyramidWithTriangleBaseQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  hasGeogebra: true,
  is3d: true,
  subject: "Mathématiques",
};
