import {
  Exercise,
  Question,
  QuestionGenerator,
  GGBVEA,
  GetHint,
  GetCorrection,
  GetInstruction,
  GetStudentGGBOptions,
  GetGGBAnswer,
} from "#root/exercises/exercise";
import { toolBarConstructor } from "#root/exercises/utils/geogebra/toolBarConstructor";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { ggbPointToCoords } from "#root/geogebra/parsers/ggbPointToCoords";
import { parseGGBPoints } from "#root/geogebra/parsers/parseGGBPoints";
import { Point } from "#root/math/geometry/point";
import { NumberType } from "#root/math/numbers/nombre";
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { random } from "#root/utils/alea/random";

type Identifiers = {
  abscissType: NumberType;
  axisUnit: number; //for ggb
  oneUnitTex: string;
  absciss: number;
  abscissTex: string;
  coeff: number;
};

const getInstruction: GetInstruction<Identifiers> = ({ abscissTex }) => {
  return `Placer le point d'abscisse $${abscissTex}$ sur la droite graduée ci-dessous :`;
};

// const getHint: GetHint<Identifiers> = (identifiers) => {};
// const getCorrection: GetCorrection<Identifiers> = (identifiers) => {};
const getGGBAnswer: GetGGBAnswer<Identifiers> = ({ absciss, coeff }) => {
  return [`(${coeff},0)`];
};

const getStudentGGBOptions: GetStudentGGBOptions<Identifiers> = ({
  coeff,
  oneUnitTex,
  abscissType,
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
  ];
  const ggb = new GeogebraConstructor({
    commands,
    customToolBar: toolBarConstructor({
      point: true,
    }),
    hideGrid: true,
    xAxis: {
      hideNumbers: true,
      steps: 1,
    },
    yAxis: {
      hidden: true,
    },
    forbidShiftDragZoom: true,
  });
  return ggb.getOptions({
    coords: [-7, 7, -2, 2],
  });
};

const isGGBAnswerValid: GGBVEA<Identifiers> = (
  ans,
  { ggbAnswer, absciss, abscissTex, abscissType, axisUnit, coeff, oneUnitTex },
) => {
  const points = parseGGBPoints(ans).map((p) => ggbPointToCoords(p));
  return (
    points.length === 1 &&
    points[0].y === 0 &&
    Math.abs(points[0].x - coeff) < 0.1
  );
};

const getPlaceAbscissOnLineQuestion: QuestionGenerator<Identifiers> = () => {
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
    abscissTex,
    abscissType,
    axisUnit,
    coeff,
    oneUnitTex,
  };
  const question: Question<Identifiers> = {
    ggbAnswer: getGGBAnswer(identifiers),
    instruction: getInstruction(identifiers),
    studentGgbOptions: getStudentGGBOptions(identifiers),
    identifiers,
    // hint: getHint(identifiers),
    // correction: getCorrection(identifiers),
  };

  return question;
};

export const placeAbscissOnLine: Exercise<Identifiers> = {
  id: "placeAbscissOnLine",
  label: "Placer un point d'abscisse donnée sur une droite graduée",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getPlaceAbscissOnLineQuestion, nb),
  ggbTimer: 60,
  isGGBAnswerValid,
  subject: "Mathématiques",
  // getHint,
  // getCorrection,
  getGGBAnswer,
  getStudentGGBOptions,
  answerType: "GGB",
};
