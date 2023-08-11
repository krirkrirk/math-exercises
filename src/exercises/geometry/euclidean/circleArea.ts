import { Exercise, Question, Proposition } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const circleArea: Exercise = {
  id: 'circleArea',
  connector: '=',
  instruction: '',
  label: "Calculer l'aire d'un cercle",
  levels: ['4', '3', '2'],
  isSingleStep: false,
  section: 'Géométrie euclidienne',
  generator: (nb: number) => getDistinctQuestions(getCircleArea, nb),
};

export function getCircleArea(): Question {
  const radius = randint(1, 13);
  const diametre = randint(1, 21);

  const coin = coinFlip();
  const correctAnswer = coin ? round(Math.PI * radius ** 2, 2) + '' : round(Math.PI * (diametre / 2) ** 2, 2) + '';

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: correctAnswer,
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = round(Math.random() * 100, 2) + '';
        proposition = {
          id: v4() + '',
          statement: wrongAnswer,
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction: `Calculer l'aire d'un cercle de ${coin ? 'rayon ' + radius : 'diamètre ' + diametre} cm.`,
    answer: correctAnswer,
    getPropositions,
  };

  return question;
}
