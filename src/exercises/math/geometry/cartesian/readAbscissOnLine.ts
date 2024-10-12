import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  GGBVEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
  GetAnswer,
  GetHint,
  GetCorrection,
  GetInstruction,
  GetKeys,
  GetGGBOptions,
  GetStudentGGBOptions,
  GetGGBAnswer,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { Point } from "#root/math/geometry/point";
import { NumberType } from "#root/math/numbers/nombre";
import { Rational } from "#root/math/numbers/rationals/rational";
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { parseLatex } from "#root/tree/parsers/latexParser";
import { random } from "#root/utils/alea/random";

type Identifiers = {
  abscissType: NumberType;
  axisUnit: number; //for ggb
  oneUnitTex: string;
  absciss: number;
  abscissTex: string;
  coeff: number;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, absciss, abscissTex, abscissType, axisUnit, oneUnitTex },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const unitNode = parseLatex(oneUnitTex);
  while (propositions.length < n) {
    const coeff = randint(-6, 7, [0, 1]);
    tryToAddWrongProp(
      propositions,
      new MultiplyNode(unitNode, coeff.toTree()).simplify().toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = ({
  absciss,
  abscissType,
  axisUnit,
  abscissTex,
  oneUnitTex,
}) => {
  return abscissTex;
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  return `Quelle est l'abscisse du point $A$ sur la droite graduée ci-dessous ?`;
};
const getGGBOptions: GetGGBOptions<Identifiers> = ({
  absciss,
  abscissType,
  axisUnit,
  oneUnitTex,
  coeff,
}) => {
  const O = new Point("O", (0).toTree(), (0).toTree());
  const I = new Point("I", (1).toTree(), (0).toTree());
  const A = new Point("A", coeff.toTree(), (0).toTree());
  const commands = [
    ...O.toGGBCommand(),
    `Text("\\small 0", (0, -0.5), false, true, 0, 0)`,
    ...I.toGGBCommand(),
    `Text("\\small ${oneUnitTex}", (1, ${
      abscissType === NumberType.Rational ? -1 : -0.5
    }), false, true, 0, 0)`,
    ...A.toGGBCommand(),
  ];
  const ggb = new GeogebraConstructor({
    hideGrid: true,
    forbidShiftDragZoom: true,
    commands,
    yAxis: {
      hidden: true,
    },
    xAxis: {
      hideNumbers: true,
      steps: 1,
    },
  });
  return ggb.getOptions({
    coords: [-7, 7, -2, 2],
  });
};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return [];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer, abscissTex }) => {
  try {
    const node = parseLatex(abscissTex);
    return node
      .toAllValidTexs({
        allowFractionToDecimal: true,
        allowMinusAnywhereInFraction: true,
      })
      .includes(ans);
  } catch (err) {
    return false;
  }
};

const getReadAbscissOnLineQuestion: QuestionGenerator<Identifiers> = () => {
  const abscissType = random([
    NumberType.Integer,
    NumberType.Rational,
    NumberType.Decimal,
  ]);
  let absciss: number,
    axisUnit: number,
    oneUnitTex: string,
    abscissTex: string,
    coeff: number;
  switch (abscissType) {
    case NumberType.Integer:
      axisUnit = randint(1, 10);
      coeff = randint(-6, 7, [0, 1]);
      absciss = axisUnit * coeff;
      oneUnitTex = axisUnit.frenchify();
      abscissTex = absciss.frenchify();
      break;
    case NumberType.Rational:
      const randomFrac = random([
        [1, 2],
        [1, 3],
        [2, 3],
        [1, 4],
        [3, 4],
        [1, 5],
        [2, 5],
        [3, 5],
        [4, 5],
      ]);
      axisUnit = randomFrac[0] / randomFrac[1];
      const oneUnit = new FractionNode(
        randomFrac[0].toTree(),
        randomFrac[1].toTree(),
      );
      oneUnitTex = oneUnit.toTex();
      coeff = randint(-6, 7, [0, 1]);
      absciss = axisUnit * coeff;
      abscissTex = new MultiplyNode(oneUnit, coeff.toTree()).simplify().toTex();
      break;
    case NumberType.Decimal:
    default:
      axisUnit = randfloat(0, 5, 1);
      coeff = randint(-6, 7, [0, 1]);
      absciss = round(axisUnit * coeff, 2);
      oneUnitTex = axisUnit.frenchify();
      abscissTex = absciss.frenchify();
      break;
  }
  const identifiers: Identifiers = {
    absciss,
    axisUnit,
    oneUnitTex,
    abscissType,
    abscissTex,
    coeff,
  };
  const question: Question<Identifiers> = {
    answer: getAnswer(identifiers),
    instruction: getInstruction(identifiers),
    keys: getKeys(identifiers),
    answerFormat: "tex",
    identifiers,
    ggbOptions: getGGBOptions(identifiers),
  };

  return question;
};

export const readAbscissOnLine: Exercise<Identifiers> = {
  id: "readAbscissOnLine",
  connector: "=",
  label: "Lire une abscisse sur une droite graduée",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getReadAbscissOnLineQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  ggbTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  getAnswer,
  getGGBOptions,
  hasGeogebra: true,
};
