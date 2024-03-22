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
} from "../exercise";
import { getDistinctQuestions } from "../utils/getDistinctQuestions";

type Identifiers = {
  randomUnitIndex: number;
  randomUnitInstructionIndex: number;
  randomCapacity: number;
};
const units = ["mL", "cL", "dL", "L", "daL", "hL", "kL"];

const getCapacityConversion: QuestionGenerator<Identifiers> = () => {
  const randomUnitIndex = randint(0, 7);
  const randomUnitInstructionIndex = randint(0, 7, [randomUnitIndex]);
  const randomCapacity = DecimalConstructor.random(0, 1000, randint(0, 4));
  const answer = (
    randomCapacity.multiplyByPowerOfTen(
      randomUnitIndex - randomUnitInstructionIndex,
    ).value + ""
  ).replace(".", ",");
  const question: Question<Identifiers> = {
    instruction: `Compléter : $${randomCapacity.value
      .toString()
      .replace(".", ",")} \\textrm{${
      units[randomUnitIndex]
    }} = \\ldots \\textrm{${units[randomUnitInstructionIndex]}}$`,
    answer,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      randomCapacity: randomCapacity.value,
      randomUnitIndex,
      randomUnitInstructionIndex,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, randomCapacity, randomUnitIndex, randomUnitInstructionIndex },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const capacityDecimal = new Decimal(randomCapacity);
  while (propositions.length < n) {
    const wrongAnswer = capacityDecimal
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

export const capacityConversion: Exercise<Identifiers> = {
  id: "capacityConversion",
  connector: "=",
  getPropositions,

  label: "Conversion de capacités",
  levels: ["6ème", "5ème", "CAP", "2ndPro"],
  sections: ["Conversions"],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getCapacityConversion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  isAnswerValid,
  subject: "Mathématiques",
};
