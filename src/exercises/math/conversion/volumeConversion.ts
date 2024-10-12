import {
  Decimal,
  DecimalConstructor,
} from "#root/math/numbers/decimals/decimal";
import { randint } from "#root/math/utils/random/randint";
import { shuffle } from "#root/utils/alea/shuffle";
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
  randomVolume: number;
};
const units = ["mm", "cm", "dm", "m", "dam", "hm", "km"];

const getVolumeConversion: QuestionGenerator<Identifiers> = () => {
  const randomUnitIndex = randint(0, 7);
  const randomUnitInstructionIndex = randint(
    // cette manip a pour but d'éviter des conversion de type km³ --> cm³ ou le contraire (chiffre trop grand/petit)
    randomUnitIndex - 2 < 0 ? 0 : randomUnitIndex - 2,
    randomUnitIndex + 2 > 6 ? 6 : randomUnitIndex + 2,
    [randomUnitIndex],
  );
  const randomVolume = DecimalConstructor.random(0, 1000, randint(0, 4));
  const answer = (
    randomVolume.multiplyByPowerOfTen(
      3 * (randomUnitIndex - randomUnitInstructionIndex),
    ).value + ""
  ).replace(".", ",");
  const question: Question<Identifiers> = {
    instruction: `Compléter : $${randomVolume.value
      .toString()
      .replace(".", ",")} \\textrm{${
      units[randomUnitIndex]
    }}^3 = \\ldots \\textrm{${units[randomUnitInstructionIndex]}}^3$`,
    answer,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      randomUnitIndex,
      randomUnitInstructionIndex,
      randomVolume: randomVolume.value,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, randomUnitIndex, randomUnitInstructionIndex, randomVolume },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const volumeDecimal = new Decimal(randomVolume);
  while (propositions.length < n) {
    const wrongAnswer = volumeDecimal
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

export const volumeConversion: Exercise<Identifiers> = {
  id: "volumeConversion",
  connector: "=",
  label: "Conversion de volumes",
  levels: ["6ème", "5ème", "CAP", "2ndPro"],
  sections: ["Conversions"],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getVolumeConversion, nb),
  getPropositions,
  isAnswerValid,

  qcmTimer: 60,
  freeTimer: 60,
  subject: "Mathématiques",
};
