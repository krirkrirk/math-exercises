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
import {
  Decimal,
  DecimalConstructor,
} from "#root/math/numbers/decimals/decimal";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { coinFlip } from "#root/utils/alea/coinFlip";

type Identifiers = {
  dec: number;
  isDecimalToHours: boolean;
};

const getHoursToDecimalQuestion: QuestionGenerator<Identifiers> = () => {
  const isDecimalToHours = coinFlip();
  const dec = DecimalConstructor.random(0, 3, 2);
  const hours = Math.floor(dec.value);
  const mins = round((dec.value - hours) * 100 * 0.6, 0);
  const decTex = dec.toTree().toTex();
  const durationTex = isDecimalToHours
    ? decTex + "\\text{h}"
    : `${hours}\\text{h}${mins}\\text{min}`;
  const answer = isDecimalToHours
    ? `${hours}\\text{h}${mins}\\text{min}`
    : `${hours},${round((mins / 60) * 100, 0)}\\text{h}`;
  const question: Question<Identifiers> = {
    answer,
    instruction: `Convertir la durée suivante en ${
      isDecimalToHours ? "heures et minutes" : "$\\text{h}$ (nombre décimal)"
    } : $${durationTex}$ (arrondir ${
      isDecimalToHours ? "à la minute près" : "au centième près"
    })`,
    keys: ["hours", "minutes"],
    answerFormat: "tex",
    identifiers: { isDecimalToHours, dec: dec.value },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, isDecimalToHours, dec },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const hours = Math.floor(dec);
  const mins = round((dec - hours) * 0.6 * 100, 0);
  if (isDecimalToHours) {
    tryToAddWrongProp(
      propositions,
      `${hours}\\text{h}${round((dec - hours) * 100, 0)}\\text{min}`,
    );
    while (propositions.length < n) {
      tryToAddWrongProp(
        propositions,
        `${hours}\\text{h}${randint(1, 100)}\\text{min}`,
      );
    }
  } else {
    tryToAddWrongProp(propositions, `${hours},${mins}\\text{h}`);
    while (propositions.length < n) {
      tryToAddWrongProp(
        propositions,
        DecimalConstructor.random(hours, hours + 1, 2)
          .toTree()
          .toTex() + "\\text{h}",
      );
    }
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, isDecimalToHours, dec },
) => {
  if (isDecimalToHours) return ans === answer;
  // const hours = Math.floor(dec);
  // const mins = round((dec - hours) * 100 * 0.6, 0);
  const texs = [answer, answer.replace("\\text{h}", "")];
  return texs.includes(ans);
};
export const hoursToDecimal: Exercise<Identifiers> = {
  id: "hoursToDecimal",
  connector: "=",
  label: "Convertir une durée en nombre décimal et inversement",
  levels: ["2nde", "2ndPro", "3ème"],
  isSingleStep: true,
  sections: ["Conversions"],
  generator: (nb: number) =>
    getDistinctQuestions(getHoursToDecimalQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
