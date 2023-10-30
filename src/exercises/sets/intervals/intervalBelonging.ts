import { MathExercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { IntervalConstructor } from '#root/math/sets/intervals/intervals';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const intervalBelonging: MathExercise = {
  id: 'intervalBelonging',
  connector: '=',
  instruction: '',
  label: '=',
  levels: ['2nde', '2ndPro', '1reESM'],
  isSingleStep: true,
  sections: ['Ensembles et intervalles'],
  generator: (nb: number) => getDistinctQuestions(getIntervalBelongingQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getIntervalBelongingQuestion(): Question {
  const interval = IntervalConstructor.random();
  const isIn = coinFlip();

  let nb = '';
  let answer = '';
  if (isIn) {
    answer = '\\in';
    nb = interval.getRandomElement().toTree().toTex();
  } else {
    answer = '\\notin';
    nb = '2';
  }
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: ``,
      isRightAnswer: true,
      format: 'tex',
    });

    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = '';
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

    return shuffle(res);
  };

  const question: Question = {
    answer,
    instruction: `Compléter par $\\in$ ou $\\notin$ : $\\ ${nb} \\ldots ${interval.toTex()}$`,
    keys: ['belongs', 'notin'],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
