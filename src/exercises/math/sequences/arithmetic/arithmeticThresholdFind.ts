import { Polynomial } from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import { shuffle } from "#root/utils/alea/shuffle";
import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "../../../exercise";
import { getDistinctQuestions } from "../../../utils/getDistinctQuestions";

type Identifiers = {
  firstValue: number;
  reason: number;
  randValue: number;
};

const getArithmeticThresholdFind: QuestionGenerator<Identifiers> = () => {
  const firstValue = randint(-10, 10);
  const reason = randint(-10, 10, [0]);
  let randValue = firstValue;

  const formula = new Polynomial([firstValue, reason], "n");

  let instruction = `$(u_n)$ est une suite arithmétique définie par $u_n = ${formula
    .toTree()
    .toTex()}$. `;

  if (reason > 0) {
    randValue += randint(reason, 100);
    instruction += `À partir de quel rang $n$ a-t-on $u_n > ${randValue}$ ?`;
  } else {
    randValue += randint(-100, reason);
    instruction += `À partir de quel rang $n$ a-t-on $u_n < ${randValue}$ ?`;
  }
  const answer = (Math.floor((randValue - firstValue) / reason) + 1).toString();

  const question: Question<Identifiers> = {
    instruction,
    startStatement: `n`,
    answer,
    keys: ["r", "n", "u", "underscore", "inf", "sup", "approx"],
    answerFormat: "tex",
    identifiers: { randValue, firstValue, reason },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, randValue, firstValue, reason },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      (
        Math.floor((randValue - firstValue) / reason) + randint(-5, 6, [1])
      ).toString(),
    );
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const arithmeticThresholdFind: Exercise<Identifiers> = {
  id: "arithmeticThresholdFind",
  connector: "=",
  label: "Calculer un seuil à l'aide d'une suite arithmétique",
  levels: ["1reESM", "1reSpé", "1reTech", "1rePro", "TermTech", "TermPro"],
  sections: ["Suites"],
  isSingleStep: false,
  generator: (nb: number) =>
    getDistinctQuestions(getArithmeticThresholdFind, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
