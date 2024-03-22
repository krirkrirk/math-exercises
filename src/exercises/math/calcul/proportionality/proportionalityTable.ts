import {
  Exercise,
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
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  randQuation: number;
  x1: string | number;
  x2: string | number;
  x3: string | number;
  x4: string | number;
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

  const question: Question<Identifiers> = {
    instruction: `On considère le tableau de proportionnalité suivant : 

| | |
|-|-|
|${x1}|${x3}|
|${x2}|${x4}|

Déterminer le nombre manquant.`,
    answer: answer,
    keys: [],
    answerFormat: "tex",
    identifiers: { randQuation, x1, x2, x3, x4 },
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
};
