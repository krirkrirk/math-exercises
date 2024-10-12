import { RemarkableValueConstructor } from "#root/math/trigonometry/remarkableValue";
import { remarkableTrigoValues } from "#root/math/trigonometry/remarkableValues";
import { randint } from "#root/math/utils/random/randint";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { shuffle } from "#root/utils/alea/shuffle";
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
} from "../../exercise";
import { getDistinctQuestions } from "../../utils/getDistinctQuestions";
type Identifiers = {
  valueIndex: number;
  isCos: boolean;
};

const getMainRemarkableValues: QuestionGenerator<Identifiers> = () => {
  const isCos = coinFlip();

  const valueIndex = randint(0, remarkableTrigoValues.length);
  const remarkableValue = remarkableTrigoValues[valueIndex];
  const answer = isCos
    ? remarkableValue.cos.toTex()
    : remarkableValue.sin.toTex();

  const statement = isCos
    ? `\\cos\\left(${remarkableValue.angle.toTex()}\\right)`
    : `\\sin\\left(${remarkableValue.angle.toTex()}\\right)`;

  const question: Question<Identifiers> = {
    instruction: `Donner la valeur exacte de : $${statement}$`,
    startStatement: statement,
    answer: answer,
    keys: ["pi", "cos", "sin"],
    answerFormat: "tex",
    identifiers: { valueIndex, isCos },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
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
  shuffle(values);
  values.forEach((value) => {
    tryToAddWrongProp(propositions, value);
  });

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { valueIndex, isCos }) => {
  const remarkableValue = remarkableTrigoValues[valueIndex];
  const answer = isCos ? remarkableValue.cos : remarkableValue.sin;
  const texs = answer.toAllValidTexs({
    allowFractionToDecimal: true,
    allowMinusAnywhereInFraction: true,
  });
  return texs.includes(ans);
};
export const mainRemarkableValuesExercise: Exercise<Identifiers> = {
  id: "mainRemarkableValues",
  connector: "=",
  label: "Valeurs remarquables de $\\cos$ et $\\sin$ sur $[-\\pi, \\pi]$",
  levels: ["1reSpé", "TermSpé", "MathComp"],
  isSingleStep: true,
  sections: ["Trigonométrie"],
  generator: (nb: number) =>
    getDistinctQuestions(getMainRemarkableValues, nb, 18),
  qcmTimer: 60,
  freeTimer: 60,
  maxAllowedQuestions: 18,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
