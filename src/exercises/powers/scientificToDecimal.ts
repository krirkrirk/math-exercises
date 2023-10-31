/**
 * a*10^x vers décimal
 *  */

import { DecimalConstructor } from '#root/math/numbers/decimals/decimal';
import { IntegerConstructor } from '#root/math/numbers/integer/integer';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { shuffle } from '#root/utils/shuffle';
import { MathExercise, Proposition, Question, tryToAddWrongProp } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
import { v4 } from 'uuid';

export const scientificToDecimal: MathExercise = {
  id: 'scientificToDecimal',
  connector: '=',
  instruction: '',
  label: "Passer d'écriture scientifique à écriture décimal",
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
  keys: [],

  generator: (nb: number) => getDistinctQuestions(getScientificToDecimalQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getScientificToDecimalQuestion(): Question {
  const decScientific = DecimalConstructor.randomScientific(randint(1, 4));
  const tenPower = randint(-5, 6, [0, 1]);
  const answer = decScientific.multiplyByPowerOfTen(tenPower).toTree().toTex();

  const statement = new MultiplyNode(
    new NumberNode(decScientific.value),
    new PowerNode(new NumberNode(10), new NumberNode(tenPower)),
  );
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });

    tryToAddWrongProp(res, decScientific.multiplyByPowerOfTen(-tenPower).toTree().toTex());
    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswerTree = decScientific.multiplyByPowerOfTen(randint(-6, 6, [tenPower])).toTree();
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
    instruction: `Donner l'écriture décimale de : $${statement.toTex()}$`,
    startStatement: statement.toTex(),
    answer: answer,
    keys: [],
    getPropositions,
    answerFormat: 'tex',
  };
  return question;
}
