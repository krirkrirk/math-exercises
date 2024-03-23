import {
  Decimal,
  DecimalConstructor,
} from "#root/math/numbers/decimals/decimal";
import { randint } from "#root/math/utils/random/randint";
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
import { v4 } from "uuid";

type Identifiers = {
  randomUnitIndex: number;
  randomUnitInstructionIndex: number;
  randomLength: number;
};
const units = ["mm", "cm", "dm", "m", "dam", "hm", "km"];

const getLengthConversion: QuestionGenerator<Identifiers> = () => {
  const randomUnitIndex = randint(0, 7);
  const randomUnitInstructionIndex = randint(0, 7, [randomUnitIndex]);
  const randomLength = DecimalConstructor.random(0, 1000, randint(0, 4));
  console.log("length conv q");
  const answer = (
    randomLength.multiplyByPowerOfTen(
      randomUnitIndex - randomUnitInstructionIndex,
    ).value + ""
  ).replace(".", ",");
  const question: Question<Identifiers> = {
    instruction: `Compléter : $${randomLength.value
      .toString()
      .replace(".", ",")} \\textrm{${
      units[randomUnitIndex]
    }} = \\ldots  \\textrm{${units[randomUnitInstructionIndex]}}$`,
    answer,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      randomLength: randomLength.value,
      randomUnitIndex,
      randomUnitInstructionIndex,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, randomLength, randomUnitIndex, randomUnitInstructionIndex },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const lengthDecimal = new Decimal(randomLength);
  while (propositions.length < n) {
    console.log("length conv qcm");
    const wrongAnswer = lengthDecimal
      .multiplyByPowerOfTen(
        randint(-3, 4, [randomUnitIndex - randomUnitInstructionIndex]),
      )
      .value.toString()
      .replace(".", ",");
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const lengthConversion: Exercise<Identifiers> = {
  id: "lengthConversion",
  connector: "=",
  label: "Conversion de longueurs",
  levels: ["6ème", "5ème", "CAP", "2ndPro"],
  sections: ["Conversions"],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getLengthConversion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
