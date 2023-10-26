import { MathExercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Integer } from '#root/math/numbers/integer/integer';
import { Rational, RationalConstructor } from '#root/math/numbers/rationals/rational';
import { randint } from '#root/math/utils/random/randint';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const fractionAndIntegerProduct: MathExercise = {
  id: 'fractionAndIntegerProduct',
  connector: '=',
  instruction: "Calculer et donner le résultat sous la forme d'une fraction irréductible.",
  label: "Produit d'un entier et d'une fraction",
  levels: ['4ème', '3ème', '2nde', 'CAP', '2ndPro', '1rePro'],
  isSingleStep: false,
  sections: ['Fractions'],
  generator: (nb: number) => getDistinctQuestions(getFractionAndIntegerProduct, nb),
  keys: [],
  qcmTimer: 60,
  freeTimer: 60,
};

export function getFractionAndIntegerProduct(): Question {
  const rational = RationalConstructor.randomIrreductible();
  const integer = new Integer(randint(-10, 11, [0, 1]));
  const statementTree = new MultiplyNode(rational.toTree(), integer.toTree());
  statementTree.shuffle();

  const answerTree = rational.multiply(integer).toTree();
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
      statement: new Rational(integer.value * rational.num, integer.value * rational.denum).toTex(),
      isRightAnswer: false,
      format: 'tex',
    });

    for (let i = 0; i < n - 2; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const randomMultiplier = randint(-10, 10);
        const wrongAnswerTree = rational.multiply(new Integer(randomMultiplier)).toTree();
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
    instruction: '',
    startStatement: statementTree.toTex(),
    answer: answerTree.toTex(),
    keys: [],
    getPropositions,
    answerFormat: 'tex',
  };
  return question;
}
