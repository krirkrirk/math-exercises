import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const firstDegreeDerivative: Exercise = {
  id: 'firstDegreeDerivative',
  connector: '=',
  instruction: '',
  label: "Dérivée d'un polynôme de degré 1",
  levels: ['1', '0'],
  section: 'Dérivation',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getFirstDegreeDerivative, nb),
  keys: ['x'],
};

export function getFirstDegreeDerivative(): Question {
  const [a, b] = [randint(-9, 10, [0]), randint(-9, 10)];
  const polynomial = new Polynomial([b, a]);

  const getPropositions = (n: number) => {
    const propositions: Proposition[] = [];

    propositions.push({
      id: v4(),
      statement: a + '',
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate;
      let proposition: Proposition;

      do {
        const wrongAnswer = randint(-9, 10);
        proposition = {
          id: v4(),
          statement: wrongAnswer + '',
          isRightAnswer: false,
        };

        isDuplicate = propositions.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      propositions.push(proposition);
    }

    return shuffle(propositions);
  };

  const question: Question = {
    instruction: `Déterminer la fonction dérivée $f'$ de la fonction $f$ définie par $f(x) = ${polynomial.toString()}$.`,
    startStatement: `f'(x)`,
    answer: a + '',
    keys: [],
    getPropositions,
  };

  return question;
}
