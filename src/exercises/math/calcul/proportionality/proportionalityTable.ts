import {
  Exercise,
  GetInstruction,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { IntegerConstructor } from "#root/math/numbers/integer/integer";
import { randint } from "#root/math/utils/random/randint";
import { shuffle } from "#root/utils/alea/shuffle";
import { dollarize } from "#root/utils/latex/dollarize";
import { mdTable } from "#root/utils/markdown/mdTable";

type Identifiers = {
  randQuation: number;
  x1: string | number;
  x2: string | number;
  x3: string | number;
  x4: string | number;
};

const getInstruction: GetInstruction<Identifiers> = ({ x1, x2, x3, x4 }) => {
  return `On considère le tableau de proportionnalité suivant : 

${mdTable([
  [dollarize(x1), dollarize(x3)],
  [dollarize(x2), dollarize(x4)],
])}

Déterminer le nombre manquant.`;
};

const getProportionalityTable: QuestionGenerator<Identifiers> = () => {
  const fact = randint(2, 10);
  let [x1, x2]: (string | number)[] = IntegerConstructor.randomDifferents(
    1,
    100 / fact,
    2,
  );
  let [x3, x4]: (string | number)[] = [x1 * fact, x2 * fact];
  let answer = "";

  const randQuation = randint(0, 4);

  switch (randQuation) {
    case 0:
      answer = x1 + "";
      x1 = "?";
      break;
    case 1:
      answer = +x2 + "";
      x2 = "?";
      break;
    case 2:
      answer = x3 + "";
      x3 = "?";
      break;
    case 3:
      answer = x4 + "";
      x4 = "?";
      break;
  }
  const identifiers = { x1, x2, x3, x4, randQuation };
  const question: Question<Identifiers> = {
    instruction: getInstruction(identifiers),
    answer: answer,
    keys: [],
    answerFormat: "tex",
    identifiers: { randQuation, x1, x2, x3, x4 },
    style: {
      tableHasNoHeader: true,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      Number(answer) + randint(Number(-answer) + 1, 20, [0]) + "",
    );
  }
  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const proportionalityTable: Exercise<Identifiers> = {
  id: "proportionalityTable",
  connector: "=",
  label: "Calcul dans un tableau de proportionnalité",
  levels: ["5ème", "4ème", "3ème", "CAP", "2ndPro", "1rePro"],
  isSingleStep: false,
  sections: ["Proportionnalité"],
  generator: (nb: number) => getDistinctQuestions(getProportionalityTable, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  getInstruction,
};
