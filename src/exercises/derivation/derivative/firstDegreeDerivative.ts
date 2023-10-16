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
  label: "Dérivée d'une fonction affine",
  levels: ['1reESM', '1reSpé', '1reTech', 'MathComp', '1rePro', 'TermPro'],
  sections: ['Dérivation'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getFirstDegreeDerivative, nb),
  keys: ['x'],
  qcmTimer: 60,
  freeTimer: 60,
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
      format: 'tex',
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
          format: 'tex',
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
    answerFormat: 'tex',
  };

  return question;
}
