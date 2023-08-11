/**
 * a^b/a^c
 */

import { Power } from '#root/math/numbers/integer/power';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { shuffle } from '#root/utils/shuffle';
import { Exercise, Proposition, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
import { v4 } from 'uuid';

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
  let a = useOnlyPowersOfTen ? 10 : randint(-11, 11, [0]);
  const [b, c] = [1, 2].map((el) => randint(-11, 11));

  const statement = new FractionNode(
    new PowerNode(new NumberNode(a), new NumberNode(b)),
    new PowerNode(new NumberNode(a), new NumberNode(c)),
  );
  const answerTree = new Power(a, b - c).simplify();

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
        const wrongPower = b - c + randint(-5, 6, [0, c - b]);
        const wrongAnswerTree = new Power(a === 1 || a === -1 ? randint(-3, 4, [-1, 1]) : a, wrongPower).simplify(); // pour éviter les 1 1 -1 1 dans propositions
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
