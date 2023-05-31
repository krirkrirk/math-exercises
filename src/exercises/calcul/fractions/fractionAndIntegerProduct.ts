import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Integer } from '#root/math/numbers/integer/integer';
import { RationalConstructor } from '#root/math/numbers/rationals/rational';
import { randint } from '#root/math/utils/random/randint';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';

export const fractionAndIntegerProduct: Exercise = {
  id: 'fractionAndIntegerProduct',
  connector: '=',
  instruction: "Calculer et donner le résultat sous la forme d'une fraction irréductible.",
  label: "Produit d'un entier et d'une fraction",
  levels: ['4', '3', '2', '1'],
  isSingleStep: false,
  section: 'Fractions',
  generator: (nb: number) => getDistinctQuestions(getFractionAndIntegerProduct, nb),
  keys: [],
};

export function getFractionAndIntegerProduct(): Question {
  const rational = RationalConstructor.randomIrreductible();
  const integer = new Integer(randint(-10, 11, [0]));
  const statementTree = new MultiplyNode(rational.toTree(), integer.toTree());
  statementTree.shuffle();

  const answerTree = rational.multiply(integer).toTree();
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];
    for (let i = 0; i < n; i++) {
      const randomMultiplier = randint(-10, 10);
      const wrongAnswerTree = rational.multiply(new Integer(randomMultiplier)).toTree();
      res.push({
        id: Math.random() + '',
        statement: wrongAnswerTree.toTex(),
        isRightAnswer: false,
      });
    }
    return res;
  };

  const question: Question = {
    instruction: '',
    startStatement: statementTree.toTex(),
    answer: answerTree.toTex(),
    keys: [],
    getPropositions,
  };
  return question;
}
