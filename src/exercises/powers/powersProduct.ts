/**
 * a^b*a^c
 */

import { Power } from '#root/math/numbers/integer/power';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { shuffle } from '#root/utils/shuffle';
import { MathExercise, Proposition, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
import { v4 } from 'uuid';

export const powersOfTenProduct: MathExercise = {
  id: 'powersOfTenProduct',
  connector: '=',
  instruction: '',
  label: 'Multiplication de puissances de 10',
  levels: ['4ème', '3ème', '2nde', 'CAP', '2ndPro', '1reESM', '1rePro', '1reSpé', '1reTech', 'TermPro', 'TermTech'],
  sections: ['Puissances'],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(() => getPowersProductQuestion(true), nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export const powersProduct: MathExercise = {
  id: 'powersProduct',
  connector: '=',
  instruction: '',
  label: 'Multiplication de puissances',
  levels: ['4ème', '3ème', '2nde'],
  sections: ['Puissances'],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getPowersProductQuestion, nb),
  keys: [],
  qcmTimer: 60,
  freeTimer: 60,
};

export function getPowersProductQuestion(useOnlyPowersOfTen: boolean = false): Question {
  const a = useOnlyPowersOfTen ? 10 : randint(-11, 11, [0]);
  const [b, c] = [1, 2].map((el) => randint(-11, 11));

  const statement = new MultiplyNode(
    new PowerNode(new NumberNode(a), new NumberNode(b)),
    new PowerNode(new NumberNode(a), new NumberNode(c)),
  );
  const answerTree = new Power(a, b + c).simplify();

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: answerTree.toTex(),
      isRightAnswer: true,
      format: 'tex',
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongExponent = b + c + randint(-11, 11, [0, -b - c]);
        const wrongAnswerTree = new Power(a === 1 || a === -1 ? randint(-3, 4, [-1, 1]) : a, wrongExponent).simplify();
        const wrongAnswer = wrongAnswerTree.toTex();

        proposition = {
          id: v4() + '',
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
    instruction: `Calculer : $${statement.toTex()}$`,

    startStatement: statement.toTex(),
    answer: answerTree.toTex(),
    keys: [],
    getPropositions,
    answerFormat: 'tex',
  };
  return question;
}
