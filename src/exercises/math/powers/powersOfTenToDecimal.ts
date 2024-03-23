/**
 * 10^(-x) into 0,0...1
 */

import { Power } from "#root/math/numbers/integer/power";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { shuffle } from "#root/utils/shuffle";
import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "../../exercise";
import { getDistinctQuestions } from "../../utils/getDistinctQuestions";

type Identifiers = {
  randPower: number;
};

const getPowersOfTenToDecimalQuestion: QuestionGenerator<Identifiers> = () => {
  const randPower = randint(-9, 10);

  const statement = new PowerNode(
    new NumberNode(10),
    new NumberNode(randPower),
  );
  const answerTree = new Power(10, randPower).toDecimalWriting().toTree();
  const answer = answerTree.toTex().replace(".", ",");
  const statementTex = statement.toTex();
  const question: Question<Identifiers> = {
    instruction: `Donner l'écriture décimale de : $${statementTex}$`,
    startStatement: statementTex,
    answer,
    keys: [],
    answerFormat: "tex",
    identifiers: { randPower },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, randPower },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const wrongPower = randPower + randint(-3, 4, [0]);
    const wrongAnswerTree = new Power(10, wrongPower)
      .toDecimalWriting()
      .toTree();
    const wrongAnswer = wrongAnswerTree.toTex();
    tryToAddWrongProp(propositions, wrongAnswer.replace(".", ","));
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const powersOfTenToDecimal: Exercise<Identifiers> = {
  id: "powersOfTenToDecimal",
  connector: "=",
  label: "Ecriture décimale d'une puissance de 10",
  levels: [
    "5ème",
    "4ème",
    "3ème",
    "2nde",
    "CAP",
    "2ndPro",
    "1reESM",
    "1rePro",
    "1reSpé",
    "1reTech",
    "TermPro",
    "TermTech",
  ],
  sections: ["Puissances"],
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getPowersOfTenToDecimalQuestion, nb, 19),
  qcmTimer: 60,
  freeTimer: 60,
  maxAllowedQuestions: 19,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
