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
  DecimalConstructor,
  decimalDigitRanks,
} from "#root/math/numbers/decimals/decimal";
import {
  IntegerConstructor,
  integerDigitRanks,
} from "#root/math/numbers/integer/integer";
import { randint } from "#root/math/utils/random/randint";
import { toSeperatedThousands } from "#root/utils/numberPrototype/toSeparatedThousands";

type Identifiers = {
  nb: number;
  rankAsked: number;
};

const ordinals = ["premier", "deuxième", "troisième", "quatrième"];
const getDigitRankNumberQuestion: QuestionGenerator<Identifiers> = () => {
  const decimalPartSize = randint(2, 5);
  const nb = DecimalConstructor.random(0, 1000, decimalPartSize);
  const rankAsked = randint(0, Math.min(decimalPartSize, 3));
  const rankAskedLabel = decimalDigitRanks[rankAsked];
  const str = nb.tex;
  const answer =
    str.split(".")[0] + str.split(".")[1].substring(0, rankAsked + 1);

  const question: Question<Identifiers> = {
    answer,
    instruction: `Quel est le nombre de ${rankAskedLabel} dans le nombre $${toSeperatedThousands(
      nb.toTree().toTex(),
    )}$ ?`,
    keys: [],
    //   hint: `Attention ! On demande le 'nombre' et non pas le 'chiffre' !`,
    //   correction: `Le chiffre des ${rankAskedLabel} est le ${ordinals[rankAsked]} chiffre en partant de la droite. Donc le chiffre des ${rankAskedLabel} est $${answer}$.`,
    answerFormat: "tex",
    identifiers: { nb: nb.value, rankAsked },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, nb, rankAsked },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const str = nb.toString();
  const [intPart, fracPart] = str.split(".");
  tryToAddWrongProp(propositions, fracPart[rankAsked]);

  for (let i = 0; i < str.length; i++) {
    tryToAddWrongProp(propositions, intPart + fracPart.substring(0, i + 1));
  }
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(0, 100) + "");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const digitDecimalRankNumber: Exercise<Identifiers> = {
  id: "digitDecimalRankNumber",
  connector: "=",
  label: "Déterminer le nombre de dixièmes, de centièmes...",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getDigitRankNumberQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  // hasHintAndCorrection: true,
};
