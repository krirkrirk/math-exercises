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
import { Line } from "#root/math/geometry/line";
import { Point, PointConstructor } from "#root/math/geometry/point";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";

type Identifiers = {};

const getCartesianEquationOfLineQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const a = new Point(
    "A",
    new NumberNode(randint(-5, 6)),
    new NumberNode(randint(-5, 6)),
  );
  const b = new Point(
    "B",
    new NumberNode(randint(-5, 6)),
    new NumberNode(randint(-5, 6)),
  );
  const line = new Line(a, b);

  const commands = [
    `A(${a.getXnumber()},${a.getYnumber()})`,
    `B(${b.getXnumber()},${b.getYnumber()})`,
    `Line(A,(${b.getXnumber()},${b.getYnumber()}))`,
  ];

  const ggb = new GeogebraConstructor(commands, { isGridSimple: true });
  const correctAnswer = line.getCartesianEquation();

  const aX = a.getXnumber();
  const aY = a.getYnumber();
  const question: Question<Identifiers> = {
    answer: correctAnswer.toTex(),
    commands: ggb.commands,
    options: ggb.getOptions(),
    coords: ggb.getAdaptedCoords({
      xMin: aX - 5,
      xMax: aX + 5,
      yMin: aY - 5,
      yMax: aY + 5,
    }),
    instruction: ``,
    keys: [],
    answerFormat: "tex",
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
export const cartesianEquationOfLine: Exercise<Identifiers> = {
  id: "cartesianEquationOfLine",
  label: "Test",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Droites"],
  generator: (nb: number) =>
    getDistinctQuestions(getCartesianEquationOfLineQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  hasGeogebra: true,
  subject: "Mathématiques",
};