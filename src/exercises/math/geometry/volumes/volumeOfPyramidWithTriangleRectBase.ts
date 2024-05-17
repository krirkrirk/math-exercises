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
import { SqrtNode } from "#root/tree/nodes/functions/sqrtNode";
import { isNumberNode } from "#root/tree/nodes/numbers/numberNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { random } from "#root/utils/random";

type Identifiers = {
  h: number;
  baseOfPyramidSides: TriangleSides;
};

type ExerciseVars = {
  commands: string[];
  h: number;
  baseOfPyramidSides: TriangleSides;
};

type TriangleSides = { ABSide: number; ACSide: number; BCSide: number };

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

const getVolumeOfPyramidWithTriangleRectBase: QuestionGenerator<
  Identifiers
> = () => {
  const exercise = generateExercise();
  const commands = exercise.commands;
  const baseOfPyramidSides = exercise.baseOfPyramidSides;
  const volume = calculateVolume(baseOfPyramidSides, exercise.h);

  const ggb = new GeogebraConstructor(commands, {
    hideAxes: true,
    hideGrid: true,
    is3d: true,
  });

  const maxCoord = Math.max(
    baseOfPyramidSides.ABSide,
    baseOfPyramidSides.ACSide,
  );

  const question: Question<Identifiers> = {
    answer: volume.simplify().toTex(),
    instruction: `Soit une pyramide à base triangulaire de hauteur $${exercise.h}$. 
    Cacluler le volume de la pyramide en sachant $AB=${baseOfPyramidSides.ABSide}, AC=${baseOfPyramidSides.ACSide}, BC=${baseOfPyramidSides.BCSide}$`,
    keys: [],
    answerFormat: "tex",
    commands: ggb.commands,
    options: ggb.getOptions(),
    coords: [-2, maxCoord + 1, -2, maxCoord + 1, -2, exercise.h + 1],
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
  baseOfPyramidSides: TriangleSides,
  h: number,
): string[] => {
  const firstProposition = new FractionNode(
    (
      baseOfPyramidSides.ABSide +
      baseOfPyramidSides.ACSide +
      baseOfPyramidSides.BCSide
    ).toTree(),
    (3).toTree(),
  )
    .simplify()
    .toTex();
  const secondProposition = new FractionNode(
    (baseOfPyramidSides.ABSide * baseOfPyramidSides.ACSide).toTree(),
    (2).toTree(),
  )
    .simplify()
    .toTex();

  return [firstProposition, secondProposition];
};
const generateExercise = (): ExerciseVars => {
  const h = randint(1, 11);
  const base = generatePolygonWithGgbCmnds();
  const commands = base.commands.concat([
    `H=Point({${base.sideSizes.ABSide / 4},${base.sideSizes.ACSide / 4},${h}})`,
    `SetFixed(H,true)`,
    `ShowLabel(H,true)`,
    `Pyra=Pyramid(Poly,H)`,
  ]);
  return {
    commands,
    h,
    baseOfPyramidSides: base.sideSizes,
  };
};

const calculateVolume = (sideSize: TriangleSides, h: number): AlgebraicNode => {
  return new FractionNode(
    new MultiplyNode(
      new FractionNode(
        (sideSize.ABSide * sideSize.ACSide).toTree(),
        (2).toTree(),
      ),
      h.toTree(),
    ),
    (3).toTree(),
  );
};

const generatePolygonWithGgbCmnds = (): {
  commands: string[];
  sideSizes: TriangleSides;
} => {
  const values = random(pythagoreTriplet);
  const ABSide = values[0];
  const ACSide = values[1];
  return {
    commands: [
      `A=Point({0,0,0})`,
      `B=Point({${ABSide},0,0})`,
      `C=Point({0,${ACSide},0})`,
      `ang=Angle(C,A,B)`,
      `ShowLabel(ang,false)`,
      `ShowLabel(A,True)`,
      `ShowLabel(B,True)`,
      `ShowLabel(C,True)`,
      `SetFixed(A,true)`,
      `SetFixed(B,true)`,
      `SetFixed(C,true)`,
      `Poly=Polygon(A,B,C)`,
    ],
    sideSizes: { ABSide, ACSide, BCSide: values[2] },
  };
};
export const volumeOfPyramid: Exercise<Identifiers> = {
  id: "volumeOfPyramidWithTriangleRectBase",
  label: "Calcul du volume d'une pyramide avec une base triangle rectangle",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Géométrie euclidienne"],
  generator: (nb: number) =>
    getDistinctQuestions(getVolumeOfPyramidWithTriangleRectBase, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  hasGeogebra: true,
  is3d: true,
  subject: "Mathématiques",
};
