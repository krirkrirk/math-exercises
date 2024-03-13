import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
import { shuffle } from "#root/utils/shuffle";
import { v4 } from "uuid";

type Identifiers = {
  reason: number;
  startRank: number;
  startValue: number;
};

const getGeometricReasonUsage: QuestionGenerator<Identifiers> = () => {
  const reason = randint(2, 10);
  const startRank = randint(0, 20);
  const askedRank = startRank + 1;
  const startValue = randint(1, 10);
  const answer = (startValue * reason).toString();
  const question: Question<Identifiers> = {
    instruction: `$(u_n)$ est une suite géométrique de raison $q = ${reason}$ et on sait que $u_{${startRank}} = ${startValue}$. Calculer : $u_{${askedRank}}$`,
    startStatement: `u_{${askedRank}}`,
    answer,
    keys: ["u", "underscore", "equal"],
    answerFormat: "tex",
    identifiers: { startValue, reason, startRank },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, startValue, reason },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  if (startValue + reason !== 4)
    tryToAddWrongProp(propositions, (startValue + reason).toString());

  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      startValue * (reason + randint(-reason + 1, 6, [0])) + "",
    );
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, startRank }) => {
  return [
    answer,
    `u_{${startRank}}=${answer}`,
    `u_${startRank}=${answer}`,
  ].includes(ans);
};

export const geometricReasonUsage: MathExercise<Identifiers> = {
  id: "geometricReasonUsage",
  connector: "=",
  label: "Utiliser la raison d'une suite géométrique",
  levels: ["1reESM", "1reSpé", "1reTech", "1rePro", "TermTech", "TermPro"],
  sections: ["Suites"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getGeometricReasonUsage, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
