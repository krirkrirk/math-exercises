import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const inverseFunctionDerivative: Exercise = {
  id: 'inverseFunctionDerivative',
  connector: '=',
  instruction: '',
  label: "Dérivée d'une fonction inverse",
  levels: ['1', '0'],
  section: 'Dérivation',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getInverseFunctionDerivative, nb),
  keys: ['x'],
};

export function getInverseFunctionDerivative(): Question {
  const a = randint(-9, 10, [0]);

  const getPropositions = (n: number) => {
    const propositions: Proposition[] = [];

    propositions.push({
      id: v4(),
      statement: `\\frac{${-a}}{x^2}`,
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate;
      let proposition: Proposition;

      do {
        const wrongAnswer = `\\frac{${randint(-9, 10, [0, -a])}}{x^2}`;
        proposition = {
          id: v4(),
          statement: wrongAnswer,
          isRightAnswer: false,
        };

        isDuplicate = propositions.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      propositions.push(proposition);
    }

    return shuffle(propositions);
  };

  const question: Question = {
    instruction: `Déterminer la fonction dérivée $f'$ de la fonction $f$ définie par $f(x) =\\frac{${a}}{x}$.`,
    startStatement: `f'(x)`,
    answer: `\\frac{${-a}}{x^2}`,
    keys: ['x'],
    getPropositions,
  };

  return question;
}
