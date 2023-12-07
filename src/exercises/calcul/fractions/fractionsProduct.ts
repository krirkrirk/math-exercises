import { MathExercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { RationalConstructor } from '#root/math/numbers/rationals/rational';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const fractionsProduct: MathExercise = {
  id: 'fractionsProduct',
  connector: '=',
  label: 'Produits de fractions',
  levels: ['4ème', '3ème', '2nde', 'CAP', '2ndPro', '1rePro'],
  sections: ['Fractions'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getFractionsProduct, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getFractionsProduct(): Question {
  const rational = RationalConstructor.randomIrreductible();
  const rational2 = RationalConstructor.randomIrreductible();
  const statementTree = new MultiplyNode(rational.toTree(), rational2.toTree());
  const answerTree = rational.multiply(rational2).toTree();

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];
    res.push({
      id: v4() + '',
      statement: answerTree.toTex(),
      isRightAnswer: true,
      format: 'tex',
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const randomRational = RationalConstructor.randomIrreductible();
        const wrongAnswerTree = randomRational.multiply(rational2).toTree();
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
    answerFormat: 'tex',
  };
  return question;
}
