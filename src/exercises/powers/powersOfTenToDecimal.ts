/**
 * 10^(-x) into 0,0...1
 */

import { Power } from '#root/math/numbers/integer/power';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { shuffle } from '#root/utils/shuffle';
import { MathExercise, Proposition, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
import { v4 } from 'uuid';

export const powersOfTenToDecimal: MathExercise = {
  id: 'powersOfTenToDecimal',
  connector: '=',
  instruction: "Donner l'écriture décimale de :",
  label: "Ecriture décimale d'une puissance de 10",
  levels: [
    '5ème',
    '4ème',
    '3ème',
    '2nde',
    'CAP',
    '2ndPro',
    '1reESM',
    '1rePro',
    '1reSpé',
    '1reTech',
    'TermPro',
    'TermTech',
  ],
  sections: ['Puissances'],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getPowersOfTenToDecimalQuestion, nb, 19),
  keys: [],
  qcmTimer: 60,
  freeTimer: 60,
  maxAllowedQuestions: 19,
};

export function getPowersOfTenToDecimalQuestion(): Question {
  const randPower = randint(-9, 10);

  const statement = new PowerNode(new NumberNode(10), new NumberNode(randPower));
  const answerTree = new Power(10, randPower).toDecimalWriting().toTree();

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
        const wrongPower = randPower + randint(-3, 4, [0]);
        const wrongAnswerTree = new Power(10, wrongPower).toDecimalWriting().toTree();
        const wrongAnswer = wrongAnswerTree.toTex();
        console.log(wrongPower, wrongAnswer);
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
    startStatement: statement.toTex(),
    answer: answerTree.toTex(),
    keys: [],
    getPropositions,
    answerFormat: 'tex',
  };
  return question;
}
