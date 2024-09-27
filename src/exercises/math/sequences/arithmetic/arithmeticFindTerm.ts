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
import { randint } from "#root/math/utils/random/randint";
import { random } from "#root/utils/random";

type Identifiers = {
  firstRank: number;
  firstTerm: number;
  reason: number;
  askedRank: number;
};

const getArithmeticFindTermQuestion: QuestionGenerator<Identifiers> = () => {
  const firstRank = random([0, 1]);
  const firstTerm = randint(-15, 15);
  const reason = randint(-10, 10, [0]);
  const askedRank = randint(5, 15);
  const answer = firstTerm + reason * (askedRank - firstRank);
  const question: Question<Identifiers> = {
    answer: answer + "",
    instruction: `Soit $u$ la suite arithmétique de premier terme $u_${firstRank} = ${firstTerm}$ et de raison $r = ${reason}$. Calculer $u_{${askedRank}}$.`,
    keys: [],
    answerFormat: "tex",
    identifiers: { firstRank, askedRank, firstTerm, reason },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, askedRank, firstRank, firstTerm, reason },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const fake = firstTerm + reason * (askedRank - randint(-4, 4, [firstRank]));
    tryToAddWrongProp(propositions, fake + "");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const arithmeticFindTerm: Exercise<Identifiers> = {
  id: "arithmeticFindTerm",
  connector: "=",
  label:
    "Calculer un terme d'une suite arithmétique à partir de son premier terme et sa raison",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getArithmeticFindTermQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
