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
const getDigitRankNumberQuestion: QuestionGenerator<Identifiers> = () => {
  const size = randint(3, 6);
  const nb = IntegerConstructor.random(size);
  const rankAsked = randint(0, Math.min(size, 4));
  const rankAskedLabel = integerDigitRanks[rankAsked];
  const nbString = nb.toString();
  const answer = nbString.substring(0, nbString.length - rankAsked);
  const question: Question<Identifiers> = {
    answer,
    instruction: `Quel est le nombre ${
      rankAsked === 0 ? "d'" : "de "
    }${rankAskedLabel} dans le nombre $${nb.toTree().toTex()}$ ?`,
    keys: [],

    answerFormat: "tex",
    identifiers: { nb, rankAsked },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, nb, rankAsked },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const nbString = nb.toString();
  tryToAddWrongProp(propositions, nbString[nbString.length - rankAsked - 1]);
  for (let i = 0; i < nbString.length; i++) {
    tryToAddWrongProp(propositions, nbString.substring(0, nbString.length - i));
  }
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(0, 100) + "");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const digitRankNumber: Exercise<Identifiers> = {
  id: "digitRankNumber",
  connector: "=",
  label: "Déterminer le nombre d'unités/de dizaines/de centièmes...",
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
};
