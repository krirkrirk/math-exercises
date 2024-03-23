import { RemarkableValueConstructor } from "#root/math/trigonometry/remarkableValue";
import { remarkableTrigoValues } from "#root/math/trigonometry/remarkableValues";
import { CosNode } from "#root/tree/nodes/functions/cosNode";
import { SinNode } from "#root/tree/nodes/functions/sinNode";
import { coinFlip } from "#root/utils/coinFlip";
import { random } from "#root/utils/random";
import { shuffle } from "#root/utils/shuffle";
import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "../../exercise";
import { getDistinctQuestions } from "../../utils/getDistinctQuestions";

const values = [
  "-1",
  "-\\frac{\\sqrt 3}{2}",
  "-\\frac{\\sqrt 2}{2}",
  "-\\frac{1}{2}",
  "0",
  "\\frac{\\sqrt 3}{2}",
  "\\frac{\\sqrt 2}{2}",
  "\\frac{1}{2}",
  "1",
];

type Identifiers = {
  mainValue: number;
  isCos: boolean;
};
const getRemarkableValues: QuestionGenerator<Identifiers> = () => {
  const isCos = coinFlip();
  const remarkableValue = RemarkableValueConstructor.simplifiable();
  const mainValue = remarkableValue.mainAngle.evaluate({});
  // const valueIndex = remarkableValue.index;
  const answer = isCos
    ? remarkableValue.cos.toTex()
    : remarkableValue.sin.toTex();

  const statement = isCos
    ? new CosNode(remarkableValue.angle).toTex()
    : new SinNode(remarkableValue.angle).toTex();
  const question: Question<Identifiers> = {
    instruction: `Donner la valeur exacte de : $${statement}$`,
    startStatement: statement,
    answer: answer,
    keys: ["pi", "cos", "sin"],
    answerFormat: "tex",
    identifiers: { isCos, mainValue },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    const statement = random(values);
    tryToAddWrongProp(propositions, statement);
  }
  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { mainValue, isCos }) => {
  const remarkableValue = remarkableTrigoValues.find(
    (point) => Math.abs(point.angle.evaluate({}) - mainValue) < 0.0001,
  )!;
  const answer = isCos ? remarkableValue.cos : remarkableValue.sin;
  const texs = answer.toAllValidTexs({
    allowFractionToDecimal: true,
    allowMinusAnywhereInFraction: true,
  });
  return texs.includes(ans);
};
export const remarkableValuesExercise: Exercise<Identifiers> = {
  id: "remarkableValues",
  connector: "=",
  label: "Valeurs remarquables de $\\cos$ et $\\sin$",
  levels: ["1reSpé", "TermSpé", "MathComp"],
  isSingleStep: true,
  sections: ["Trigonométrie"],
  generator: (nb: number) => getDistinctQuestions(getRemarkableValues, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
