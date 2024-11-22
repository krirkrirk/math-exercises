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
import { numberVEA } from "#root/exercises/vea/numberVEA";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { shuffle } from "#root/utils/alea/shuffle";

const getMentalPercentage: QuestionGenerator<Identifiers> = () => {
  let a = 1,
    b = 1;

  const rand = randint(1, 10);

  switch (rand) {
    case 1: // 10% de 70%
      a = 10 * randint(1, 3);
      b = randint(1, 200);
      break;

    case 2: // 30% de 9
      a = randint(1, 10);
      b = randint(1, 10) * a;
      a *= 10;
      break;

    case 3: // 32% de 10
      a = randint(1, 100);
      b = 10 ** randint(1, 3);
      break;

    case 4: // 14% de 50 ou 230% de 20
      a = coinFlip() ? randint(1, 100) : randint(11, 30) * 10;
      b = coinFlip() ? 20 : 50;
      break;

    case 5: // 12.5% de 72
      a = coinFlip() ? 12.5 : 12.5 + 100;
      b = 8 * randint(1, 25);
      break;

    case 6: // 15% de 90
      a = coinFlip() ? 15 * randint(1, 6) : 30 * randint(1, 4, [2]) + 100;
      b = 3 * randint(1, 10) * 10;
      break;

    case 7: // 20% de x
      a = 20 * randint(1, 12, [5]);
      b = 5 * randint(1, 21);
      break;

    case 8: // 75% de x
      a = 25 * randint(1, 8, [4]);
      b = 4 * randint(1, 75);
      break;

    case 9: //0.5 % de 1000
      a = randint(1, 10) / 10;
      b = 1000;
      break;
  }

  const answer = ((a * b) / 100 + "").replace(".", ",");
  const question: Question<Identifiers> = {
    instruction: `Calculer : $${String(a).replace(".", ",")}\\%$ de $${b}$.`,
    answer,
    keys: [],
    answerFormat: "tex",
    identifiers: { rand, a, b },
  };

  return question;
};

type Identifiers = {
  rand: number;
  a: number;
  b: number;
};
const getPropositions: QCMGenerator<Identifiers> = (n, { answer, rand }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  let a: number = 0;
  let b: number = 0;
  while (propositions.length < n) {
    switch (rand) {
      case 1: // 10% de 70%
        a = 10 * randint(1, 3);
        b = randint(1, 200);
        break;

      case 2: // 30% de 9
        a = randint(1, 10);
        b = randint(1, 10) * a;
        a *= 10;
        break;

      case 3: // 32% de 10
        a = randint(1, 100);
        b = 10 ** randint(1, 3);
        break;

      case 4: // 14% de 50 ou 230% de 20
        a = coinFlip() ? randint(1, 100) : randint(11, 30) * 10;
        b = coinFlip() ? 20 : 50;
        break;

      case 5: // 12.5% de 72
        a = coinFlip() ? 12.5 : 12.5 + 100;
        b = 8 * randint(1, 25);
        break;

      case 6: // 15% de 90
        a = coinFlip() ? 15 * randint(1, 6) : 30 * randint(1, 4, [2]) + 100;
        b = 3 * randint(1, 10) * 10;
        break;

      case 7: // 20% de x
        a = 20 * randint(1, 12, [5]);
        b = 5 * randint(1, 21);
        break;

      case 8: // 75% de x
        a = 25 * randint(1, 8, [4]);
        b = 4 * randint(1, 75);
        break;

      case 9: //0.5 % de 1000
        a = randint(1, 10) / 10;
        b = 1000;
        break;
    }
    let incorrectAnswer = (a * b) / 100;
    tryToAddWrongProp(
      propositions,
      incorrectAnswer.toString().replace(".", ","),
    );
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (studentAns, { answer }) => {
  return numberVEA(studentAns, answer);
};

export const mentalPercentage: Exercise<Identifiers> = {
  id: "mentalPercentage",
  connector: "=",
  label: "Effectuer mentalement des calculs de pourcentages simples",
  levels: [
    "6ème",
    "5ème",
    "4ème",
    "3ème",
    "2nde",
    "1reESM",
    "CAP",
    "2ndPro",
    "1rePro",
    "TermPro",
  ],
  sections: ["Pourcentages"],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getMentalPercentage, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
