import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Integer } from '#root/math/numbers/integer/integer';
import { RationalConstructor } from '#root/math/numbers/rationals/rational';
import { randint } from '#root/math/utils/random/randint';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const fractionAndIntegerSum: Exercise = {
  id: 'fractionAndIntegerSum',
  connector: '=',
  instruction: "Calculer et donner le résultat sous la forme d'une fraction irréductible.",
  label: "Somme d'un entier et d'une fraction",
  levels: ['4ème', '3ème', '2nde', 'CAP', '2ndPro', '1rePro'],
  isSingleStep: false,
  sections: ['Fractions'],
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
    instruction: '',
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
