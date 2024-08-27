import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  GGBVEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import {
  Decimal,
  DecimalConstructor,
  decimalDigitRanks,
} from "#root/math/numbers/decimals/decimal";
import { randint } from "#root/math/utils/random/randint";

type Identifiers = {
  nb: string;
  rankAsked: number;
};

const getDigitDecimalRankQuestion: QuestionGenerator<Identifiers> = () => {
  const decimalPartSize = randint(2, 5);
  const nb = DecimalConstructor.random(0, 1000, decimalPartSize);
  const rankAsked = randint(0, Math.min(decimalPartSize, 3));
  const rankAskedLabel = decimalDigitRanks[rankAsked];
  const decimalPartString = nb.decimalPart;
  const answer = decimalPartString[rankAsked];
  const question: Question<Identifiers> = {
    answer,
    instruction: `Quel est le chiffre des ${rankAskedLabel} dans le nombre $${nb
      .toTree()
      .toTex()}$ ?`,
    keys: [],
    answerFormat: "tex",
    identifiers: { nb: nb.tex, rankAsked },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, nb }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const decimal = new Decimal(Number(nb));
  for (let i = 0; i < decimal.decimalPart.length; i++) {
    tryToAddWrongProp(propositions, decimal.decimalPart[i]);
  }
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(0, 10) + "");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

const isGGBAnswerValid: GGBVEA<Identifiers> = (ans, { ggbAnswer }) => {
  throw Error("GGBVea not implemented");
};
export const digitDecimalRank: Exercise<Identifiers> = {
  id: "digitDecimalRank",
  connector: "=",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getDigitDecimalRankQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  isGGBAnswerValid,
  subject: "Mathématiques",
};
