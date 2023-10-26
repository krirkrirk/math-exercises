import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { MathExercise, Proposition, Question, tryToAddWrongProp } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
import { v4 } from 'uuid';

export const quartilesList: MathExercise = {
  id: 'quartilesList',
  connector: '=',
  instruction: '',
  label: "Calcul des quartiles d'une liste",
  levels: ['3ème', '2nde', 'CAP', '2ndPro', '1rePro', '1reTech'],
  isSingleStep: false,
  sections: ['Statistiques'],
  generator: (nb: number) => getDistinctQuestions(getQuartiles, nb),
  keys: [],
  qcmTimer: 60,
  freeTimer: 60,
};

export function getQuartiles(): Question {
  let randomValeurs: number[] = [];
  const length = randint(5, 9);

  for (let i = 0; i < length; i++) randomValeurs.push(randint(1, 20));

  const sortedValues = randomValeurs.sort((a, b) => a - b);

  const firstQuartileIndex = Math.round(randomValeurs.length / 4 + 0.49);
  const thirdQuartileIndex = Math.round((3 * randomValeurs.length) / 4 + 0.49);

  const firstQuartile = sortedValues[firstQuartileIndex - 1];
  const thirdQuartile = sortedValues[thirdQuartileIndex - 1];

  const randomQuartile = randint(0, 2);

  let quartileToString;
  let choosenQuartile: number;

  switch (randomQuartile) {
    case 0:
      quartileToString = 'premier quartile';
      choosenQuartile = firstQuartile;
      break;

    case 1:
      quartileToString = 'troisième quartile';
      choosenQuartile = thirdQuartile;
      break;

    default:
      quartileToString = 'troisième quartile';
      choosenQuartile = thirdQuartile;
      break;
  }

  let stringList = '';

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: choosenQuartile + '',
      isRightAnswer: true,
      format: 'tex',
    });

    randomValeurs.forEach((value) => {
      tryToAddWrongProp(res, value + '');
    });

    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const randValue = randint(0, 100);
        proposition = {
          id: v4() + '',
          statement: randValue + '',
          isRightAnswer: false,
          format: 'tex',
        };
        console.log('iter', randomValeurs);
        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction: `On considère la liste suivante : $${randomValeurs.join(';\\ ')}.$
    $\\\\$Calculer le ${quartileToString} de cette série de valeurs.`,

    answer: choosenQuartile + '',
    keys: [],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
