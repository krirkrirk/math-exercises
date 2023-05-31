import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Integer } from '#root/math/numbers/integer/integer';
import { RationalConstructor } from '#root/math/numbers/rationals/rational';
import { randint } from '#root/math/utils/random/randint';
import { DivideNode } from '#root/tree/nodes/operators/divideNode';
import { coinFlip } from '#root/utils/coinFlip';

export const fractionAndIntegerDivision: Exercise = {
  id: 'fractionAndIntegerDivision',
  connector: '=',
  instruction: "Calculer et donner le résultat sous la forme d'une fraction irréductible.",
  label: "Division d'un entier et d'une fraction",
  levels: ['4', '3', '2', '1'],
  isSingleStep: false,
  section: 'Fractions',
  generator: (nb: number) => getDistinctQuestions(getFractionAndIntegerDivision, nb),
  keys: [],
};

export function getFractionAndIntegerDivision(): Question {
  const rational = RationalConstructor.randomIrreductible();
  const integer = new Integer(randint(-10, 11, [0]));

  const integerFirst = coinFlip();
  const statementTree = integerFirst
    ? new DivideNode(integer.toTree(), rational.toTree())
    : new DivideNode(rational.toTree(), integer.toTree());

  const answerTree = integerFirst ? integer.divide(rational).toTree() : rational.divide(integer).toTree();

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];
    for (let i = 0; i < n; i++) {
      const wrongRational = RationalConstructor.randomIrreductible();
      const wrongAnswerTree = integerFirst
        ? integer.divide(wrongRational).toTree()
        : wrongRational.divide(integer).toTree();

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
