import { MathExercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Integer } from '#root/math/numbers/integer/integer';
import { Rational, RationalConstructor } from '#root/math/numbers/rationals/rational';
import { randint } from '#root/math/utils/random/randint';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const fractionAndIntegerSum: MathExercise = {
  id: 'fractionAndIntegerSum',
  connector: '=',
  instruction: '',
  label: "Somme d'un entier et d'une fraction",
  levels: ['4ème', '3ème', '2nde', 'CAP', '2ndPro', '1rePro'],
  isSingleStep: false,
  sections: ['Fractions'],
  generator: (nb: number) => getDistinctQuestions(getFractionAndIntegerSum, nb),
  keys: [],
  qcmTimer: 60,
  freeTimer: 60,
};

export function getFractionAndIntegerSum(): Question {
  const rational = RationalConstructor.randomIrreductible();
  const integer = new Integer(randint(-10, 11, [0]));
  const statementTree = new AddNode(rational.toTree(), integer.toTree());
  statementTree.shuffle();
  const answerTree = rational.add(integer).toTree();

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: answerTree.toTex(),
      isRightAnswer: true,
      format: 'tex',
    });

    res.push({
      id: v4() + '',
      statement: new Rational(integer.value + rational.num, rational.denum).toTex(),
      isRightAnswer: false,
      format: 'tex',
    });
    if (integer.value + rational.denum !== 0)
      res.push({
        id: v4() + '',
        statement: new Rational(integer.value + rational.num, integer.value + rational.denum).toTex(),
        isRightAnswer: false,
        format: 'tex',
      });

    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const rational = RationalConstructor.randomIrreductible();
        const wrongAnswerTree = rational.add(integer).toTree();
        proposition = {
          id: v4() + '',
          statement: wrongAnswerTree.toTex(),
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
    instruction: `Calculer et donner le résultat sous la forme d'une fraction irréductible : $${statementTree.toTex()}$`,
    startStatement: statementTree.toTex(),
    answer: answerTree.toTex(),
    keys: [],
    getPropositions,
    answerFormat: 'tex',
  };
  return question;
}
