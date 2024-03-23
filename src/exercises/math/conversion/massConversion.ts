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

type Identifiers = {
  randomUnitIndex: number;
  randomUnitInstructionIndex: number;
  randomMass: number;
};
const units = ["mg", "cg", "dg", "g", "dag", "hg", "kg"];

const getMassConversion: QuestionGenerator<Identifiers> = () => {
  console.log("mass conv gen");

  const randomUnitIndex = randint(0, 7);
  const randomUnitInstructionIndex = randint(0, 7, [randomUnitIndex]);
  const randomMass = DecimalConstructor.random(0, 1000, randint(0, 4));
  const answer = (
    randomMass.multiplyByPowerOfTen(
      randomUnitIndex - randomUnitInstructionIndex,
    ).value + ""
  ).replace(".", ",");
  const question: Question<Identifiers> = {
    instruction: `Compléter : $${randomMass.value
      .toString()
      .replace(".", ",")} \\textrm{${
      units[randomUnitIndex]
    }} = \\ldots \\textrm{${units[randomUnitInstructionIndex]}}$`,
    answer,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      randomMass: randomMass.value,
      randomUnitIndex,
      randomUnitInstructionIndex,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, randomMass, randomUnitIndex, randomUnitInstructionIndex },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const massDecimal = new Decimal(randomMass);
  while (propositions.length < n) {
    console.log("mass conv prop");
    const wrongAnswer = massDecimal
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

export const massConversion: Exercise<Identifiers> = {
  id: "massConversion",
  connector: "=",
  label: "Conversion de masses",
  levels: ["6ème", "5ème", "CAP", "2ndPro"],
  sections: ["Conversions"],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getMassConversion, nb),
  getPropositions,
  isAnswerValid,
  qcmTimer: 60,
  freeTimer: 60,
  subject: "Mathématiques",
};
