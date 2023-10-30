import { MathExercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Rational } from '#root/math/numbers/rationals/rational';
import { Affine, AffineConstructor } from '#root/math/polynomials/affine';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { coinFlip } from '#root/utils/coinFlip';
import { random } from '#root/utils/random';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const firstDegreeInequationsType1: MathExercise = {
  id: 'firstDegreeInequationsType1',
  connector: '\\iff',
  instruction: '',
  label: 'Résoudre une inéquation du type $ax<b$',
  levels: ['3ème', '2ndPro', '2nde', '1reESM', '1rePro', '1reTech'],
  isSingleStep: true,
  sections: ['Inéquations'],
  generator: (nb: number) => getDistinctQuestions(getFirstDegreeInequationsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getFirstDegreeInequationsQuestion(): Question {
  const affine = new Affine(randint(-10, 10, [0, 1]), 0);
  const b = randint(-10, 11);

  const result = new Rational(b, affine.a).simplify().toTree().toTex();

  const ineqType = random(['\\le', '<', '\\ge', '>']);
  const invIneqType = ineqType === '<' ? '>' : ineqType === '>' ? '<' : ineqType === '\\le' ? '\\ge' : '\\le';
  const answer = `x${affine.a > 0 ? ineqType : invIneqType}${result}`;
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });
    res.push({
      id: v4(),
      statement: `x ${affine.a < 0 ? ineqType : invIneqType} ${result}`,
      isRightAnswer: false,
      format: 'tex',
    });

    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = `x ${coinFlip() ? ineqType : invIneqType} ${randint(-10, 11)}`;
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
    answer: answer,
    instruction: `Résoudre l'inéquation : $${affine.toTex()} ${ineqType} ${b}$ `,
    keys: ['x', 'sup', 'inf', 'geq', 'leq'],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
