import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { RationalConstructor } from '#root/math/numbers/rationals/rational';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';

export const fractionsProduct: Exercise = {
  id: 'fractionsProduct',
  connector: '=',
  instruction: "Calculer et donner le résultat sous la forme d'une fraction irréductible.",
  label: 'Produits de fractions',
  levels: ['4', '3', '2', '1'],
  section: 'Fractions',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getFractionsProduct, nb),
  keys: [],
};

export function getFractionsProduct(): Question {
  const rational = RationalConstructor.randomIrreductible();
  const rational2 = RationalConstructor.randomIrreductible();
  const statementTree = new MultiplyNode(rational.toTree(), rational2.toTree());
  const answerTree = rational.multiply(rational2).toTree();

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];
    for (let i = 0; i < n; i++) {
      const randomRational = RationalConstructor.randomIrreductible();
      const wrongAnswerTree = randomRational.multiply(rational2).toTree();
      res.push({
        id: Math.random() + '',
        statement: wrongAnswerTree.toTex(),
        isRightAnswer: false,
      });
    }
    return res;
  };

  const question: Question = {
    startStatement: statementTree.toTex(),
    answer: answerTree.toTex(),
    keys: [],
    getPropositions,
  };
  return question;
}
