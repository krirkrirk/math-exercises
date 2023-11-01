import { Decimal, DecimalConstructor } from '#root/math/numbers/decimals/decimal';
import { Integer, IntegerConstructor } from '#root/math/numbers/integer/integer';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { probaFlip } from '#root/utils/probaFlip';
import { MathExercise, Proposition, Question, shuffleProps, tryToAddWrongProp } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
import { v4 } from 'uuid';

export const decimalToScientific: MathExercise = {
  id: 'decimalToScientific',
  connector: '=',
  instruction: '',
  label: "Passer d'écriture décimale à écriture scientifique",
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

  generator: (nb: number) => getDistinctQuestions(getDecimalToScientificQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getDecimalToScientificQuestion(): Question {
  const isZero = probaFlip(0.2);
  let intPart: number, dec: Decimal;
  if (isZero) {
    dec = DecimalConstructor.fromParts('0', DecimalConstructor.randomFracPart(randint(2, 5), randint(1, 4)));
  } else {
    intPart = IntegerConstructor.random(randint(2, 5));
    dec = DecimalConstructor.fromParts(intPart.toString(), DecimalConstructor.randomFracPart(randint(1, 5)));
  }
  const decTex = dec.toTree().toTex();
  const answer = dec.toScientificNotation().toTex();
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });
    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = new MultiplyNode(
          dec.toScientificPart(),
          new PowerNode(new NumberNode(10), new NumberNode(randint(-5, 5, [0, 1]))),
        ).toTex();
        // const wrongAnswer = randint(-100, 100) + '';
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
    instruction: `Donner l'écriture scientifique de : $${decTex}$`,
    startStatement: decTex,
    answer: answer,
    keys: [],
    getPropositions,
    answerFormat: 'tex',
  };
  return question;
}
