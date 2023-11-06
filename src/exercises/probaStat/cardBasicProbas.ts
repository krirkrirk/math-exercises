import { shuffleProps, MathExercise, Proposition, Question, tryToAddWrongProp } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Rational } from '#root/math/numbers/rationals/rational';
import { randint } from '#root/math/utils/random/randint';
import { coinFlip } from '#root/utils/coinFlip';
import { probaFlip } from '#root/utils/probaFlip';
import { probaLawFlip } from '#root/utils/probaLawFlip';
import { v4 } from 'uuid';
import { CardsColor, CardsValues } from '../utils/cardsData';
import { random } from '#root/utils/random';
import { randomEnumValue } from '#root/utils/randomEnumValue';

export const cardBasicProbas: MathExercise = {
  id: 'cardBasicProbas',
  connector: '=',
  instruction: '',
  label: 'Calcul de probabilité simple avec un jeu de cartes',
  levels: ['5ème', '4ème', '3ème', '2ndPro', '2nde', 'CAP'],
  isSingleStep: true,
  sections: ['Probabilités'],
  generator: (nb: number) => getDistinctQuestions(getCardBasicProbasQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getCardBasicProbasQuestion(): Question {
  //carte précise (as de coeur)
  //carte valeur (as)
  //car couleur (pique)
  //
  const questionType = probaLawFlip<'oneCard' | 'valueCard' | 'colorCard'>([
    ['oneCard', 0.33],
    ['valueCard', 0.33],
    ['colorCard', 0.33],
  ]);
  let answer = '';
  let target = '';
  let value: string;
  let color: CardsColor;
  switch (questionType) {
    case 'oneCard':
      value = randomEnumValue(CardsValues);
      color = randomEnumValue(CardsColor);
      console.log(value);
      target = `${value === 'dame' ? 'une' : 'un'} ${value} de ${color}`;
      answer = `\\frac{1}{52}`;
      break;
    case 'valueCard':
      value = randomEnumValue(CardsValues);
      target = `${value === 'dame' ? 'une' : 'un'} ${value}`;
      answer = '\\frac{1}{13}';
      break;
    case 'colorCard':
      color = randomEnumValue(CardsColor);
      target = `un ${color}`;
      answer = `\\frac{1}{4}`;
      break;
  }

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });

    switch (questionType) {
      case 'colorCard':
        tryToAddWrongProp(res, '13');

        break;
      case 'oneCard':
        tryToAddWrongProp(res, '1');

        break;
      case 'valueCard':
        tryToAddWrongProp(res, '4');

        break;
    }

    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = new Rational(randint(1, 52), 52).simplify().tex;
        proposition = {
          id: v4() + ``,
          statement: wrongAnswer,
          isRightAnswer: false,
          format: 'tex',
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffleProps(res, n);
  };

  const question: Question = {
    answer,
    instruction: `On tire une carte dans un jeu de 52 cartes. Quelle est la probabilité d'obtenir ${target} ?`,
    keys: [],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
