import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";

type Identifiers = {
  int: number;
  power: number;
};

const getCalculatePowerQuestion: QuestionGenerator<Identifiers> = () => {
  const int = randint(-10, 11);
  const power = randint(0, 6);
  const statement = new PowerNode(
    new NumberNode(int),
    new NumberNode(power),
  ).toTex();
  const answer = int ** power + "";

  const question: Question<Identifiers> = {
    answer,
    instruction: `Calculer : $${statement}$`,
    keys: [],
    answerFormat: "tex",
    identifiers: { int, power },
  };

  return question;
};
const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, int, power },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  tryToAddWrongProp(propositions, int * power + "");
  if (int < 0) tryToAddWrongProp(propositions, -(int ** power) + "");
  if (int === 0) {
    tryToAddWrongProp(propositions, power + "");
    tryToAddWrongProp(propositions, "1");
    tryToAddWrongProp(propositions, -power + "");
    tryToAddWrongProp(propositions, "-1");
    tryToAddWrongProp(propositions, "2");
  }
  if (int === 1 || int === -1) {
    tryToAddWrongProp(propositions, power + "");
    tryToAddWrongProp(propositions, "0");
    tryToAddWrongProp(propositions, "1");
    tryToAddWrongProp(propositions, "-1");
    tryToAddWrongProp(propositions, "2");
    tryToAddWrongProp(propositions, -power + "");
  }
  while (propositions.length < n) {
    const wrongAnswer = int ** randint(0, 6, [power]) + "";
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffleProps(propositions, n);
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const calculatePower: Exercise<Identifiers> = {
  id: "calculatePower",
  connector: "=",
  label: "Calculer une puissance",
  levels: ["4ème", "3ème", "2ndPro", "2nde", "CAP"],
  isSingleStep: true,
  sections: ["Puissances"],
  generator: (nb: number) =>
    getDistinctQuestions(getCalculatePowerQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
