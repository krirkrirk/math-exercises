import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Integer } from '#root/math/numbers/integer/integer';
import { RationalConstructor } from '#root/math/numbers/rationals/rational';
import { randint } from '#root/math/utils/random/randint';
import { AddNode } from '#root/tree/nodes/operators/addNode';

export const fractionAndIntegerSum: Exercise = {
  id: 'fractionAndIntegerSum',
  connector: '=',
  instruction: "Calculer et donner le résultat sous la forme d'une fraction irréductible.",
  label: "Somme d'un entier et d'une fraction",
  levels: ['4', '3', '2', '1'],
  isSingleStep: false,
  section: 'Fractions',
  generator: (nb: number) => getDistinctQuestions(getFractionAndIntegerSum, nb),
  keys: [],
};

export function getFractionAndIntegerSum(): Question {
  const rational = RationalConstructor.randomIrreductible();
  const integer = new Integer(randint(-10, 11, [0]));
  const statementTree = new AddNode(rational.toTree(), integer.toTree());
  statementTree.shuffle();
  const answerTree = rational.add(integer).toTree();
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];
    for (let i = 0; i < n; i++) {
      const randomAddend = new Integer(randint(-10, 10));
      const wrongAnswerTree = rational.add(randomAddend).toTree();
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
