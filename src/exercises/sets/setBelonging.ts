import { MathExercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { DecimalConstructor } from '#root/math/numbers/decimals/decimal';
import { RationalConstructor } from '#root/math/numbers/rationals/rational';
import { randint } from '#root/math/utils/random/randint';
import { random } from '#root/utils/random';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const setBelonging: MathExercise = {
  id: 'setBelonging',
  connector: '\\iff',
  instruction: '',
  label: 'Déterminer le plus petit ensemble auquel un nombre appartient',
  levels: ['2nde', '1reESM'],
  isSingleStep: true,
  sections: ['Ensembles et intervalles'],
  generator: (nb: number) => getDistinctQuestions(getSetBelongingQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getSetBelongingQuestion(): Question {
  //N Z D Q R (racine2, pi)
  //fraction simplifiable en décimal/entier
  //racine carrée simplifiable en entier / Fraction
  //
  const type = randint(0, 5);
  let answer = '';
  let nb = '';
  switch (type) {
    case 0:
      nb = randint(0, 1000) + '';
      answer = '\\mathbb{N}';
      break;
    case 1:
      nb = -randint(0, 1000) + '';
      answer = '\\mathbb{Z}';
      break;
    case 2:
      nb = DecimalConstructor.random(-50, 50, randint(1, 4)).toTree().toTex();
      answer = '\\mathbb{D}';
      break;
    case 3:
      nb = RationalConstructor.randomIrreductible().toTree().toTex();
      answer = '\\mathbb{Q}';
      break;
    case 4:
      nb = random(['\\sqrt 2', '\\pi']);
      answer = '\\mathbb{R}';
      break;
  }
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];
    const availableSets = ['N', 'Z', 'D', 'Q', 'R'].map((el) => `\\mathbb{${el}}`).filter((el) => el !== answer);
    res.push({
      id: v4(),
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });

    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = random(availableSets);
        proposition = {
          id: v4(),
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
    instruction: `Donner le plus petit ensemble auquel le nombre $${nb}$ appartient.`,
    keys: ['emptyset', 'naturals', 'integers', 'decimals', 'rationals', 'reals'],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
