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
  GetAnswer,
  GetHint,
  GetCorrection,
  GetInstruction,
  GetKeys,
  GetGGBOptions,
  GetStudentGGBOptions,
  GetGGBAnswer,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { primes } from "#root/math/numbers/integer/primes";
import { randint } from "#root/math/utils/random/randint";
import { random } from "#root/utils/random";
import { primeNumbers } from "./primeNumbers";

type Identifiers = {
  nb: number;
  divisor: number;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, divisor }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  if (divisor !== 6 && divisor !== 10) tryToAddWrongProp(propositions, "2");
  if (divisor !== 6 && divisor !== 9) tryToAddWrongProp(propositions, "3");
  if (divisor !== 5) tryToAddWrongProp(propositions, "5");
  tryToAddWrongProp(propositions, "6");
  tryToAddWrongProp(propositions, "9");
  tryToAddWrongProp(propositions, "10");

  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  return identifiers.divisor + "";
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  return `Parmi les nombres suivants, lequel est un diviseur de $${identifiers.nb}$ ?`;
};

const getHint: GetHint<Identifiers> = (identifiers) => {
  return `Voici les critères de divisibilité à connaître : 
  
- Les nombres pairs (ceux qui finissent par $0$, $2$, $4$, $6$ ou $8$) sont divisibles par $2$ ;
- Si la somme des chiffres d'un nombre est dans la table de $3$, alors ce nombre est divisible par $3$ ;
- Si un nombre finit par $5$, alors il est divisible par $5$;
- Si un nombre est pair, et que la somme de ses chiffres est dans la table de $3$, alors il est divisible par $6$ ;
- Si la somme des chiffres d'un nombre est dans la table de $9$, alors il est divisible par $9$;
- Si un nombre finit par $0$, alors il est divisible par $10$.
`;
};
const getCorrection: GetCorrection<Identifiers> = ({ nb, divisor }) => {
  const sum = nb
    .toString()
    .split("")
    .reduce((acc, curr) => acc + Number(curr), 0);
  switch (divisor) {
    case 2:
      return `$${nb}$ est pair, donc il est divisible par $2$.`;
    case 3:
      return `La somme des chiffres de $${nb}$ est : $${sum}$. Or $${sum}$ est dans la table de $3$, donc $${nb}$ est divisible par $3$.`;
    case 5:
      return `$${nb}$ finit par $5$, donc il est divisible par $5$.`;
    case 6:
      return `La somme des chiffres de $${nb}$ est : $${sum}$. Or $${sum}$ est dans la table de $3$. De plus, $${nb}$ est pair. Donc $${nb}$ est divisible par $6$.`;
    case 9:
      return `La somme des chiffres de $${nb}$ est : $${sum}$. Or $${sum}$ est dans la table de $9$, donc $${nb}$ est divisible par $9$.`;
    case 10:
      return `$${nb}$ finit par $0$, donc il est divisible par $10$.`;
  }
  return "";
};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return [];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

const getDivisibiltyCriteriaQuestion: QuestionGenerator<Identifiers> = () => {
  /**
   * 2x
   * 3x
   * 5x
   * 6x
   * 9x
   * 10x
   */

  const divisor = random([2, 3, 5, 6, 9, 10]);
  const highPrime = random(primes.slice(5));
  const nb = divisor * highPrime;
  const identifiers: Identifiers = { divisor, nb };
  const question: Question<Identifiers> = {
    answer: getAnswer(identifiers),
    instruction: getInstruction(identifiers),
    keys: getKeys(identifiers),
    answerFormat: "tex",
    identifiers,
    hint: getHint(identifiers),
    correction: getCorrection(identifiers),
  };

  return question;
};

export const divisibiltyCriteria: Exercise<Identifiers> = {
  id: "divisibiltyCriteria",
  connector: "=",
  label: "Utiliser les critères de divisibilité",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getDivisibiltyCriteriaQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  ggbTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  getHint,
  getCorrection,
  getAnswer,
  hasHintAndCorrection: true,
  answerType: "QCU",
};
