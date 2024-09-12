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
  IntegerConstructor,
  integerDigitRanks,
} from "#root/math/numbers/integer/integer";
import { randint } from "#root/math/utils/random/randint";

type Identifiers = {
  nb: number;
  rankAsked: number;
};

const ordinals = ["premier", "deuxième", "troisième", "quatrième"];
const getDigitRankQuestion: QuestionGenerator<Identifiers> = () => {
  const size = randint(3, 6);
  const nb = IntegerConstructor.random(size);
  const rankAsked = randint(0, Math.min(size, 4));
  const rankAskedLabel = integerDigitRanks[rankAsked];
  const nbString = nb.toString();
  const answer = nbString[nbString.length - rankAsked - 1];
  const question: Question<Identifiers> = {
    answer,
    instruction: `Quel est le chiffre des ${rankAskedLabel} dans le nombre $${nb
      .toTree()
      .toTex()}$ ?`,
    keys: [],
    hint: `Le chiffre des ${rankAskedLabel} est le ${ordinals[rankAsked]} chiffre en partant de la droite.`,
    correction: `Le chiffre des ${rankAskedLabel} est le ${ordinals[rankAsked]} chiffre en partant de la droite. Donc le chiffre des ${rankAskedLabel} est $${answer}$.`,
    answerFormat: "tex",
    identifiers: { nb, rankAsked },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, nb }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const nbString = nb.toString();
  for (let i = 0; i < nbString.length; i++) {
    tryToAddWrongProp(propositions, nbString[i]);
  }
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(0, 10) + "");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const digitRank: Exercise<Identifiers> = {
  id: "digitRank",
  connector: "=",
  label: "Déterminer le rang d'un chiffre dans un nombre entier",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) => getDistinctQuestions(getDigitRankQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
