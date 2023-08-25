import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const inverseImageFunction: Exercise = {
  id: 'inverseImageFunction',
  connector: '\\iff',
  instruction: '',
  label: "Antécédent d'une fonction",
  levels: ['4', '3', '2'],
  section: 'Géométrie cartésienne',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getInverseImageFunction, nb),
  keys: [],
};

export function getInverseImageFunction(): Question {
  const polynome1 = new Polynomial([randint(-9, 10), randint(-5, 6, [0])]);
  const xValue = randint(-9, 10);

  const answer = polynome1.calculate(xValue);
  const statement = `Soit $f(x) = ${polynome1.toTree().toTex()}$. Calculer $x$ pour $f(x) = ${answer}$.`;

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: xValue + '',
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = xValue + randint(-10, 11, [0]);
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

  const question: Question = {
    instruction: statement,
    startStatement: `f(x) = ${answer}`,
    answer: xValue + '',
    keys: [],
    getPropositions,
  };
  return question;
}
