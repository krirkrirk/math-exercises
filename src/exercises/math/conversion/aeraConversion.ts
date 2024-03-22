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
  randomAera: number;
};
const units = ["mm", "cm", "dm", "m", "dam", "hm", "km"];

const getAeraConversion: QuestionGenerator<Identifiers> = () => {
  const randomUnitIndex = randint(0, 7);
  const randomUnitInstructionIndex = randint(
    // cette manip a pour but d'éviter des conversion de type km² --> cm² ou le contraire (chiffre trop grand/petit)
    randomUnitIndex - 2 < 0 ? 0 : randomUnitIndex - 2,
    randomUnitIndex + 2 > 7 ? 7 : randomUnitIndex + 3,
    [randomUnitIndex],
  );
  const randomAera = DecimalConstructor.random(0, 1000, randint(0, 4));
  const answer = (
    randomAera.multiplyByPowerOfTen(
      2 * (randomUnitIndex - randomUnitInstructionIndex),
    ).value + ""
  ).replace(".", ",");
  const question: Question<Identifiers> = {
    instruction: `Compléter : $${randomAera.value
      .toString()
      .replace(".", ",")} \\textrm{${
      units[randomUnitIndex]
    }}^2 = \\ldots \\textrm{${units[randomUnitInstructionIndex]}}^2$`,
    answer,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      randomAera: randomAera.value,
      randomUnitIndex,
      randomUnitInstructionIndex,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, randomAera, randomUnitIndex, randomUnitInstructionIndex },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const aeraDecimal = new Decimal(randomAera);
  while (propositions.length < n) {
    const wrongAnswer = aeraDecimal
      .multiplyByPowerOfTen(
        2 * randint(-2, 4, [randomUnitIndex - randomUnitInstructionIndex]),
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

export const aeraConversion: Exercise<Identifiers> = {
  id: "aeraConversion",
  connector: "=",
  getPropositions,
  isAnswerValid,
  label: "Conversion des aires",
  levels: ["6ème", "5ème", "CAP", "2ndPro"],
  sections: ["Conversions"],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getAeraConversion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  subject: "Mathématiques",
};
