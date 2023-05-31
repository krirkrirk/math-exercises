/**
 * a^b/a^c
 */

import { Power } from '#root/math/numbers/integer/power';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { Exercise, Proposition, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';

export const powersDivision: Exercise = {
  id: 'powersDivision',
  connector: '=',
  instruction: 'Calculer :',
  label: 'Division de puissances',
  levels: ['4', '3', '2', '1'],
  section: 'Puissances',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getPowersDivisionQuestion, nb),
};
export const powersOfTenDivision: Exercise = {
  id: 'powersOfTenDivision',
  connector: '=',
  instruction: 'Calculer :',
  label: 'Division de puissances de 10',
  levels: ['4', '3', '2', '1'],
  section: 'Puissances',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(() => getPowersDivisionQuestion(true), nb),
  keys: [],
};

export function getPowersDivisionQuestion(useOnlyPowersOfTen: boolean = false): Question {
  const a = useOnlyPowersOfTen ? 10 : randint(-11, 11, [0]);
  const [b, c] = [1, 2].map((el) => randint(-11, 11));

  const statement = new FractionNode(
    new PowerNode(new NumberNode(a), new NumberNode(b)),
    new PowerNode(new NumberNode(a), new NumberNode(c)),
  );
  const answerTree = new Power(a, b - c).simplify();

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    for (let i = 0; i < n; i++) {
      const wrongPower = b - c + randint(-5, 6, [0]);
      const wrongAnswerTree = new Power(a, wrongPower).simplify();
      const wrongAnswer = wrongAnswerTree.toTex();

      res.push({
        id: Math.random() + '',
        statement: wrongAnswer,
        isRightAnswer: false,
      });
    }

    return res;
  };

  const question: Question = {
    startStatement: statement.toTex(),
    answer: answerTree.toTex(),
    keys: [],
    getPropositions,
  };
  return question;
}
