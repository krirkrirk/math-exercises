import { MathExercise, Proposition, Question, shuffleProps, tryToAddWrongProp } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Integer } from '#root/math/numbers/integer/integer';
import { Rational } from '#root/math/numbers/rationals/rational';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const calculateNegativePower: MathExercise = {
  id: 'calculateNegativePower',
  connector: '=',
  instruction: '',
  label: 'Calculer une puissance négative',
  levels: ['4ème', '3ème', '2ndPro', '2nde', 'CAP'],
  isSingleStep: true,
  sections: ['Puissances'],
  generator: (nb: number) => getDistinctQuestions(getCalculatePowerQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getCalculatePowerQuestion(): Question {
  const int = randint(0, 11);
  const power = randint(-5, 0);
  const statement = new PowerNode(new NumberNode(int), new NumberNode(power)).toTex();
  const answer = int === 0 ? '0' : new Rational(1, int ** Math.abs(power)).simplify().toTree().toTex();
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });

    tryToAddWrongProp(res, int * power + '');
    tryToAddWrongProp(res, -(int ** Math.abs(power)) + '');
    tryToAddWrongProp(res, int * power + '');
    if (int < 0) tryToAddWrongProp(res, -(int ** power) + '');
    if (int === 0 || int === 1) {
      tryToAddWrongProp(res, power + '');
      tryToAddWrongProp(res, '0');
      tryToAddWrongProp(res, '1');
      tryToAddWrongProp(res, '-1');
      tryToAddWrongProp(res, '2');
      tryToAddWrongProp(res, -power + '');
    }
    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = new Rational(1, int ** randint(0, 6, [power])).simplify().toTree().toTex();
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
    instruction: `Calculer : $${statement}$`,
    keys: [],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
