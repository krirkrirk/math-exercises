import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const imageFunctionGeogebra: Exercise = {
  id: 'imageFunctionGeogebra',
  connector: '=',
  instruction: '',
  label: "Lecture d'une image",
  levels: ['4', '3', '2'],
  section: 'Géométrie cartésienne',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getImageFunctionGeogebra, nb),
  keys: [],
};

export function getImageFunctionGeogebra(): Question {
  const rand = coinFlip();
  const xValue = randint(-5, 6);

  let polynome1;
  do {
    polynome1 = new Polynomial([randint(-9, 10), randint(-5, 6, [0])]);
  } while (polynome1.calculate(xValue) > 10 || polynome1.calculate(xValue) < -10);

  let polynome2;
  do {
    polynome2 = new Polynomial([randint(-9, 10), randint(-9, 10), randint(-4, 5, [0])]);
  } while (polynome2.calculate(xValue) > 10 || polynome2.calculate(xValue) < -10);

  const statement = `Quelle est l'image de $${xValue}$ par la fonction $f$ représentée ci dessous ?`;

  const answer = rand ? polynome1.calculate(xValue) : polynome2.calculate(xValue);

  let xmin, xmax, ymin, ymax: number;

  if (answer > 0) {
    ymax = answer + 1;
    ymin = -1;
  } else {
    ymin = answer - 1;
    ymax = 1;
  }

  if (xValue > 0) {
    xmax = xValue + 1;
    xmin = -1;
  } else {
    xmin = xValue - 1;
    xmax = 1;
  }

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: answer + '',
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = answer + randint(-10, 11, [0]);
        proposition = {
          id: v4() + '',
          statement: wrongAnswer + '',
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const commands = [rand ? polynome1.toString() : polynome2.toString()];

  const question: Question = {
    instruction: statement,
    startStatement: `f(${xValue})`,
    answer: answer + '',
    keys: [],
    commands,
    coords: [xmin, xmax, ymin, ymax],
    getPropositions,
  };
  return question;
}
