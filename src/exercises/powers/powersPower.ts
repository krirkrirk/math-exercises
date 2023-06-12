/**
 * (a^b)^c
 */

import { Power } from '#root/math/numbers/integer/power';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { shuffle } from '#root/utils/shuffle';
import { Exercise, Proposition, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
import { v4 } from 'uuid';

export const powersOfTenPower: Exercise = {
  id: 'powersOfTenPower',
  connector: '=',
  instruction: 'Calculer :',
  label: "Puissance d'une puissance de 10 ",
  levels: ['4', '3', '2', '1'],
  section: 'Puissances',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(() => getPowersPowerQuestion(true), nb),
};

export const powersPower: Exercise = {
  id: 'powersPower',
  connector: '=',
  instruction: 'Calculer :',
  label: "Puissance d'une puissance",
  levels: ['4', '3', '2', '1'],
  section: 'Puissances',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getPowersPowerQuestion, nb),
  keys: [],
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
    });

    for (let i = 0; i < n - 1; i++) {
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
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    startStatement: statement.toTex(),
    answer: answerTree.toTex(),
    keys: [],
    getPropositions,
  };
  return question;
}
