import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { RationalConstructor } from '#root/math/numbers/rationals/rational';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { shuffle } from '#root/utils/shuffle';
import { v4 as uuidv4 } from 'uuid';

export const fractionsSum: Exercise = {
  id: 'fractionsSum',
  connector: '=',
  instruction: "Calculer et donner le résultat sous la forme d'une fraction irréductible.",
  label: 'Sommes de fractions',
  levels: ['4ème', '3ème', '2nde', 'CAP', '2ndPro', '1rePro'],
  sections: ['Fractions'],
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

    propositions.push({
      id: uuidv4(),
      statement: answerTree.toTex(),
      isRightAnswer: true,
      format: 'tex',
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const incorrectRational = RationalConstructor.randomIrreductible();
        const incorrectRational2 = RationalConstructor.randomIrreductible();
        proposition = {
          id: uuidv4(),
          statement: incorrectRational.add(incorrectRational2).toTree().toTex(),
          isRightAnswer: false,
          format: 'tex',
        };

        isDuplicate = propositions.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      propositions.push(proposition);
    }

    return shuffle(propositions);
  };

  const question: Question = {
    startStatement: statementTree.toTex(),
    answer: answerTree.toTex(),
    keys: [],
    getPropositions,
    answerFormat: 'tex',
    qcmTimer: 60,
    freeTimer: 60,
  };
  return question;
}
