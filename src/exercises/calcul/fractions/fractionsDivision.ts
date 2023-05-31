import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { RationalConstructor } from '#root/math/numbers/rationals/rational';
import { DivideNode } from '#root/tree/nodes/operators/divideNode';

export const fractionsDivision: Exercise = {
  id: 'fractionsDivision',
  connector: '=',
  instruction: "Calculer et donner le résultat sous la forme d'une fraction irréductible.",
  label: 'Divisions de fractions',
  levels: ['4', '3', '2', '1'],
  section: 'Fractions',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getFractionsDivision, nb),
  keys: [],
};

export function getFractionsDivision(): Question {
  const rational = RationalConstructor.randomIrreductible();
  const rational2 = RationalConstructor.randomIrreductible();
  const statementTree = new DivideNode(rational.toTree(), rational2.toTree());
  const answerTree = rational.divide(rational2).toTree();
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];
    for (let i = 0; i < n; i++) {
      const randomRational = RationalConstructor.randomIrreductible();
      const wrongAnswerTree = randomRational.divide(rational2).toTree();
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
