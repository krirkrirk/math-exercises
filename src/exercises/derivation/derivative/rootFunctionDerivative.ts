import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const rootFunctionDerivative: Exercise = {
  id: 'rootFunctionDerivative',
  connector: '=',
  instruction: '',
  label: "Dérivée d'une fonction racine",
  levels: ['1', '0'],
  section: 'Dérivation',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getRootFunctionDerivative, nb),
  keys: ['x'],
};

export function getRootFunctionDerivative(): Question {
  const a = randint(-9, 10, [0]);

  let instruction = `Déterminer la fonction dérivée $f'$ de la fonction $f$ définie par $f(x) =$ `;
  let answer = '';

  if (a === 1) instruction += `$\\sqrt{x}$.`;
  else if (a === -1) instruction += `$-\\sqrt{x}$.`;
  else instruction += `$${a}\\sqrt{x}$.`;

  if (a / 2 === round(a / 2, 0)) answer = `\\frac{${a / 2}}{\\sqrt{x}}`;
  else answer = `\\frac{${a}}{2\\sqrt{x}}`;

  const getPropositions = (numOptions: number) => {
    const propositions: Proposition[] = [];

    propositions.push({
      id: v4(),
      statement: answer,
      isRightAnswer: true,
    });

    for (let i = 0; i < numOptions - 1; i++) {
      let isDuplicate;
      let proposition: Proposition;

      do {
        const randomA = randint(-9, 10, [0]);
        const isEvenA = randomA / 2 === round(randomA / 2, 0);

        if (isEvenA) {
          proposition = {
            id: v4(),
            statement: `\\frac{${randomA / 2}}{\\sqrt{x}}`,
            isRightAnswer: false,
          };
        } else {
          proposition = {
            id: 'wrong' + i,
            statement: `\\frac{${randomA}}{2\\sqrt{x}}`,
            isRightAnswer: false,
          };
        }

        isDuplicate = propositions.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      propositions.push(proposition);
    }

    return shuffle(propositions);
  };

  const question: Question = {
    instruction,
    startStatement: `f'(x)`,
    answer,
    keys: ['x'],
    getPropositions,
  };

  return question;
}
