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
  firstValue: number;
  reason: number;
  nbTerms: number;
};

const getGeometricFirstTermsGeneralSumQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const firstRank = random([0, 1]);
  const firstValue = randint(-9, 10, [0]);
  const reason = randint(-5, 5, [0, 1]);
  const nbTerms = randint(4, 9);
  const answer = (firstValue * (1 - Math.pow(reason, nbTerms))) / (1 - reason);
  const question: Question<Identifiers> = {
    answer: answer + "",
    instruction: `Soit $u$ une suite géométrique de premier terme $u_${firstRank} = ${firstValue}$ et de raison $${reason}$. Calculer la somme des $${nbTerms}$ premiers termes de $u$.`,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      firstRank,
      firstValue,
      reason,
      nbTerms,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, firstRank, firstValue, reason, nbTerms },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    const fake =
      (firstValue *
        (1 -
          Math.pow(reason === -1 ? randint(2, 5) : reason, randint(3, 10)))) /
      (1 - reason);
    tryToAddWrongProp(propositions, fake.frenchify());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const geometricFirstTermsGeneralSum: Exercise<Identifiers> = {
  id: "geometricFirstTermsGeneralSum",
  connector: "=",
  label: "Somme des termes d'une suite géométrique (cas général)",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getGeometricFirstTermsGeneralSumQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
