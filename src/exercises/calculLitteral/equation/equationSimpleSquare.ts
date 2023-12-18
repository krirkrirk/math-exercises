import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
import { coinFlip } from "#root/utils/coinFlip";
import { diceFlip } from "#root/utils/diceFlip";
import { random } from "#root/utils/random";
import { shuffle } from "#root/utils/shuffle";

const squares = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((el) => el ** 2);

const higherFactor = (n: number): number => {
  for (let i = Math.floor(Math.sqrt(n)); i > 0; i--) if (n % i ** 2 === 0) return i;
  return 1;
};

type QCMProps = {
  answer: string;
  sqrt: number;
  randNbr: number;
};
type VEAProps = {};

const getEquationSimpleSquare: QuestionGenerator<QCMProps, VEAProps> = () => {
  let randNbr = randint(-20, 101);
  let answer: string;

  const rand = diceFlip(3);
  if (rand === 0) randNbr = randint(-20, 0);
  else if (rand === 1) randNbr = random(squares);
  else randNbr = randint(2, 100);

  const instruction = `Résoudre l'équation : $x^2 = ${randNbr}$`;
  const sqrt = Math.sqrt(randNbr);

  if (randNbr < 0) answer = `S=\\emptyset`;
  else if (sqrt === Math.floor(sqrt)) answer = `S=\\left\\{-${sqrt};${sqrt}\\right\\}`;
  else {
    const factor = higherFactor(randNbr);
    const radicand = randNbr / factor ** 2;
    answer = `S=\\left\\{-${factor === 1 ? "" : factor}\\sqrt{${radicand}};${
      factor === 1 ? "" : factor
    }\\sqrt{${radicand}}\\right\\}`;
  }

  const question: Question<QCMProps, VEAProps> = {
    instruction,
    answer,
    keys: ["x", "S", "equal", "lbrace", "rbrace", "semicolon", "emptyset"],
    answerFormat: "tex",
    qcmGeneratorProps: { answer, sqrt, randNbr },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, sqrt, randNbr }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  if (sqrt === Math.floor(sqrt)) {
    tryToAddWrongProp(propositions, `S=\\left\\{${sqrt}\\right\\}`);
    while (propositions.length < n) {
      const tempAns = sqrt + randint(-sqrt + 1, 7, [0]);
      tryToAddWrongProp(propositions, coinFlip() ? `S=\\left\\{${tempAns}\\ ; -${tempAns}\\right\\}` : `S=\\emptyset`);
    }
  } else if (randNbr >= 0 && sqrt !== Math.floor(sqrt)) {
    const factor = higherFactor(randNbr);
    const radicand = randNbr / factor ** 2;
    tryToAddWrongProp(propositions, `S=\\left\\{${factor}\\sqrt{${radicand}}\\right\\}`);
    tryToAddWrongProp(propositions, `S=\\left\\{${radicand}\\sqrt{${factor}}\\right\\}`);
    tryToAddWrongProp(propositions, `S=\\left\\{${Math.floor(sqrt)}\\right\\}`);

    while (propositions.length < n) {
      const tempFactor = factor + randint(-factor + 1, 7, [0]);
      const tempRadicand = radicand + randint(-radicand + 1, 7, [0]);
      tryToAddWrongProp(
        propositions,
        coinFlip()
          ? `S=\\left\\{${tempFactor}\\sqrt{${tempRadicand}}\\ ; -${tempFactor}\\sqrt{${tempRadicand}} \\right}`
          : `S=\\emptyset`,
      );
    }
  } else {
    tryToAddWrongProp(propositions, `S=\\left\\{-\\sqrt{${-randNbr}}\\right\\}`);
    tryToAddWrongProp(propositions, `S=\\left\\{${Math.floor(Math.sqrt(-randNbr))}\\right\\}`);
    while (propositions.length < n) {
      const factor = randint(2, 5);
      const radicand = randint(2, -randNbr);
      tryToAddWrongProp(
        propositions,
        `S=\\left\\{${factor}\\sqrt{${radicand}};-${factor}\\sqrt{${radicand}}\\right\\}`,
      );
    }
  }

  return shuffle(propositions);
};

export const equationSimpleSquare: MathExercise<QCMProps, VEAProps> = {
  id: "equationSimpleSquare",
  connector: "=",
  label: "Résoudre une équation du second degré du type $x^2 = a$",
  levels: ["2nde", "1reESM", "1reSpé", "1reTech"],
  sections: ["Équations"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getEquationSimpleSquare, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
