import {
  Decimal,
  DecimalConstructor,
} from "#root/math/numbers/decimals/decimal";
import { randint } from "#root/math/utils/random/randint";
import { coinFlip } from "#root/utils/coinFlip";
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
  randomValue: number;
  isVolumeToCapacity: boolean;
};
const volumeUnits = ["mm", "cm", "dm", "m", "dam", "hm", "km"];
const capacityUnits = ["mL", "cL", "dL", "L", "daL", "hL", "kL"];

const getVolumeCapacityConversion: QuestionGenerator<Identifiers> = () => {
  console.log("volume capacity q");
  const randomUnitInstructionIndex = randint(0, 7);
  const randomUnitIndex = randint(
    // cette manip a pour but d'éviter des conversion avec des nombres trop grand/petit
    randomUnitInstructionIndex - 1 < 0 ? 0 : randomUnitInstructionIndex - 1,
    randomUnitInstructionIndex + 2 > 7 ? 7 : randomUnitInstructionIndex + 2,
  );
  const random = DecimalConstructor.random(0, 1000, randint(0, 4));

  let instructionUnit;
  let answerUnit;
  let answer: Decimal;
  const isVolumeToCapacity = coinFlip();
  if (isVolumeToCapacity) {
    instructionUnit = volumeUnits[randomUnitIndex];
    answerUnit = capacityUnits[randomUnitInstructionIndex];
    answer = random.multiplyByPowerOfTen(
      3 * (randomUnitIndex - 2) + 3 - randomUnitInstructionIndex,
    );
  } else {
    instructionUnit = capacityUnits[randomUnitIndex];
    answerUnit = volumeUnits[randomUnitInstructionIndex];
    answer = random.multiplyByPowerOfTen(
      randomUnitIndex - 3 + 3 * (2 - randomUnitInstructionIndex),
    );
  }
  const answerTex = answer.toTree().toTex();
  const question: Question<Identifiers> = {
    instruction: `Compléter : $${random.value
      .toString()
      .replace(".", ",")} \\textrm{${instructionUnit}}${
      isVolumeToCapacity ? "^3" : ""
    } = \\ldots \\textrm{${answerUnit}}${!isVolumeToCapacity ? "^3" : ""}$`,
    answer: answerTex,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      isVolumeToCapacity,
      randomUnitIndex,
      randomUnitInstructionIndex,
      randomValue: random.value,
    },
  };

  return question;
};
const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const decimal = new Decimal(Number(answer.replace(",", ".")));
  while (propositions.length < n) {
    console.log("volume capactiy conv qcm");
    const wrongAnswer = decimal.multiplyByPowerOfTen(randint(-3, 4, [0]));
    tryToAddWrongProp(propositions, wrongAnswer.toTree().toTex());
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const volumeCapacityConversion: Exercise<Identifiers> = {
  id: "volumeCapacityConversion",
  connector: "=",
  getPropositions,

  label: "Conversion d'un volume vers une contenance et vice versa",
  levels: ["6ème", "5ème", "CAP", "2ndPro"],
  sections: ["Conversions"],
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getVolumeCapacityConversion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  isAnswerValid,
  subject: "Mathématiques",
};
