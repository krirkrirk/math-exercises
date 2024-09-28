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
import { toSeperatedThousands } from "#root/utils/numberPrototype/toSeparatedThousands";

type Identifiers = {
  nb: string;
  rankAsked: number;
};
const ordinals = ["premier", "deuxième", "troisième", "quatrième"];

const getDigitDecimalRankQuestion: QuestionGenerator<Identifiers> = () => {
  const decimalPartSize = randint(2, 5);
  const nb = DecimalConstructor.random(0, 1000, decimalPartSize);
  const rankAsked = randint(0, Math.min(decimalPartSize, 3));
  const rankAskedLabel = decimalDigitRanks[rankAsked];
  const decimalPartString = nb.decimalPart;
  const answer = decimalPartString[rankAsked];
  const question: Question<Identifiers> = {
    answer,
    instruction: `Quel est le chiffre des ${rankAskedLabel} dans le nombre $${toSeperatedThousands(
      nb.toTree().toTex(),
    )}$ ?`,
    keys: [],
    answerFormat: "tex",
    identifiers: { nb: nb.tex, rankAsked },
    hint: `Le chiffre des ${rankAskedLabel} est le ${ordinals[rankAsked]} chiffre après la virgule.`,
    correction: `Le chiffre des ${rankAskedLabel} est le ${ordinals[rankAsked]} chiffre après la virgule. Donc le chiffre des ${rankAskedLabel} est $${answer}$.`,
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

export const digitDecimalRank: Exercise<Identifiers> = {
  id: "digitDecimalRank",
  connector: "=",
  label: "Déterminer le rang d'un chiffre dans une partie décimale",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getDigitDecimalRankQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
