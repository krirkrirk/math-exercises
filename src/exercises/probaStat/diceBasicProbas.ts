import { shuffleProps, MathExercise, Proposition, Question, tryToAddWrongProp } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Rational } from '#root/math/numbers/rationals/rational';
import { randint } from '#root/math/utils/random/randint';
import { coinFlip } from '#root/utils/coinFlip';
import { probaFlip } from '#root/utils/probaFlip';
import { v4 } from 'uuid';

export const diceBasicProbas: MathExercise = {
  id: 'diceBasicProbas',
  connector: '=',
  instruction: '',
  label: 'Calcul de probabilité simple avec un dé',
  levels: ['5ème', '4ème', '3ème', '2ndPro', '2nde', 'CAP'],
  isSingleStep: true,
  sections: ['Probabilités'],
  generator: (nb: number) => getDistinctQuestions(getDiceBasicProbasQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getDiceBasicProbasQuestion(): Question {
  const nbFaces = randint(4, 10);
  const isParityQuestion = probaFlip(0.3);
  const isEvenQuestion = coinFlip();
  const faceAsked = randint(1, nbFaces + 1);
  const target = isParityQuestion ? `un nombre ${isEvenQuestion ? 'pair' : 'impair'}` : `la face ${faceAsked}`;
  const answer = isParityQuestion
    ? isEvenQuestion
      ? new Rational((nbFaces - 1) / 2, nbFaces).simplify().tex
      : new Rational((nbFaces + 1) / 2, nbFaces).simplify().tex
    : `\\frac{1}{${nbFaces}}`;

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });
    if (isParityQuestion) {
      tryToAddWrongProp(res, '\\frac{1}{2}');
      tryToAddWrongProp(res, Math.ceil(nbFaces / 2) + '');
    } else {
      tryToAddWrongProp(res, '1');
      tryToAddWrongProp(res, '\\frac{1}{6}');
    }

    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = new Rational(randint(1, nbFaces + 1), nbFaces).simplify().tex;
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
    instruction: `On lance un dé à ${nbFaces} faces. Quelle est la probabilité d'obtenir ${target} ?`,
    keys: [],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
