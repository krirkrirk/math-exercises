import {
  shuffleProps,
  MathExercise,
  Proposition,
  Question,
  tryToAddWrongProp,
  QuestionGenerator,
  QCMGenerator,
  addValidProp,
} from '#root/exercises/exercise';
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

type QCMProps = {
  answer: string;
  questionType: string;
};
type VEAProps = {};

const getCardBasicProbasQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
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

  const question: Question<QCMProps, VEAProps> = {
    answer,
    instruction: `On tire une carte dans un jeu de 52 cartes. Quelle est la probabilité d'obtenir ${target} ?`,
    keys: [],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, questionType },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, questionType }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  switch (questionType) {
    case 'colorCard':
      tryToAddWrongProp(propositions, '13');

      break;
    case 'oneCard':
      tryToAddWrongProp(propositions, '1');

      break;
    case 'valueCard':
      tryToAddWrongProp(propositions, '4');

      break;
  }

  while (propositions.length < n) {
    const wrongAnswer = new Rational(randint(1, 52), 52).simplify().tex;

    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffleProps(propositions, n);
};

export const cardBasicProbas: MathExercise<QCMProps, VEAProps> = {
  id: 'cardBasicProbas',
  connector: '=',
  label: 'Calcul de probabilité simple avec un jeu de cartes',
  levels: ['5ème', '4ème', '3ème', '2ndPro', '2nde', 'CAP'],
  isSingleStep: true,
  sections: ['Probabilités'],
  generator: (nb: number) => getDistinctQuestions(getCardBasicProbasQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
