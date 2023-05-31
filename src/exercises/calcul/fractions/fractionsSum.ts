import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { RationalConstructor } from '#root/math/numbers/rationals/rational';
import { AddNode } from '#root/tree/nodes/operators/addNode';

export const fractionsSum: Exercise = {
  id: 'fractionsSum',
  connector: '=',
  instruction: "Calculer et donner le résultat sous la forme d'une fraction irréductible.",
  label: 'Sommes de fractions',
  levels: ['4', '3', '2', '1'],
  section: 'Fractions',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getFractionsSum, nb),
  keys: [],
};

export function getFractionsSum(): Question {
  const rational = RationalConstructor.randomIrreductible();
  const rational2 = RationalConstructor.randomIrreductible();
  const statementTree = new AddNode(rational.toTree(), rational2.toTree());
  const answerTree = rational.add(rational2).toTree();

  const getPropositions = (n: number) => {
    const propositions: Proposition[] = [];
    for (let i = 0; i < n; i++) {
      const incorrectRational = RationalConstructor.randomIrreductible();
      const incorrectStatementTree = new AddNode(incorrectRational.toTree(), rational2.toTree());
      propositions.push({
        id: Math.random() + '',
        statement: incorrectStatementTree.toTex(),
        isRightAnswer: false,
      });
    }
    return propositions;
  };

  const question: Question = {
    startStatement: statementTree.toTex(),
    answer: answerTree.toTex(),
    keys: [],
    getPropositions,
  };
  return question;
}
