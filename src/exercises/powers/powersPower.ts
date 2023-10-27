/**
 * (a^b)^c
 */

import { Power } from '#root/math/numbers/integer/power';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { shuffle } from '#root/utils/shuffle';
import { MathExercise, Proposition, Question, shuffleProps, tryToAddWrongProp } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
import { v4 } from 'uuid';

export const powersOfTenPower: MathExercise = {
  id: 'powersOfTenPower',
  connector: '=',
  instruction: '',
  label: "Puissance d'une puissance de 10 ",
  levels: ['4ème', '3ème', '2nde', 'CAP', '2ndPro', '1reESM', '1rePro', '1reSpé', '1reTech', 'TermPro', 'TermTech'],
  sections: ['Puissances'],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(() => getPowersPowerQuestion(true), nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export const powersPower: MathExercise = {
  id: 'powersPower',
  connector: '=',
  instruction: '',
  label: "Puissance d'une puissance",
  levels: ['4ème', '3ème', '2nde'],
  sections: ['Puissances'],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getPowersPowerQuestion, nb),
  keys: [],
  qcmTimer: 60,
  freeTimer: 60,
};

export function getPowersPowerQuestion(useOnlyPowersOfTen: boolean = false): Question {
  const a = useOnlyPowersOfTen ? 10 : randint(-11, 11);
  const [b, c] = [1, 2].map((el) => randint(-11, 11));

  const statement = new PowerNode(new PowerNode(new NumberNode(a), new NumberNode(b)), new NumberNode(c));
  let answerTree = new Power(a, b * c).simplify();

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: answerTree.toTex(),
      isRightAnswer: true,
      format: 'tex',
    });

    if (a === 1 || a === 0 || a === -1) {
      tryToAddWrongProp(res, '1');
      tryToAddWrongProp(res, '-1');
      tryToAddWrongProp(res, '0');
      tryToAddWrongProp(res, b * c + '');
      tryToAddWrongProp(res, b + c + '');
    }

    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongExponent = b * c + randint(-11, 11, [0]);
        const wrongAnswerTree = new Power(a, wrongExponent).simplify();
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

    return shuffleProps(res, n);
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
