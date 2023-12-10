import { MathExercise, Proposition, Question, tryToAddWrongProp } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const rootFunctionDerivative: MathExercise<QCMProps, VEAProps> = {
  id: 'rootFunctionDerivative',
  connector: '=',
  instruction: '',
  label: "Dérivée d'une fonction racine",
  levels: ['1reESM', '1reSpé', '1reTech', 'MathComp'],
  sections: ['Dérivation', 'Racines carrées'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getRootFunctionDerivative, nb),
  keys: ['x'],
  qcmTimer: 60,
  freeTimer: 60,
};

export function getRootFunctionDerivative(): Question {
  const a = randint(-19, 20, [0]);

  let instruction = `Déterminer la fonction dérivée $f'$ de la fonction $f$ définie par $f(x) =$ `;
  let answer = '';

  if (a === 1) instruction += `$\\sqrt{x}$.`;
  else if (a === -1) instruction += `$-\\sqrt{x}$.`;
  else instruction += `$${a}\\sqrt{x}$.`;

  if (a % 2 === 0) answer = `${a < 0 ? '-' : ''}\\frac{${Math.abs(a / 2)}}{\\sqrt{x}}`;
  else answer = `${a < 0 ? '-' : ''}\\frac{${Math.abs(a)}}{2\\sqrt{x}}`;

  const getPropositions = (numOptions: number) => {
    const propositions: Proposition[] = [];

    propositions.push({
      id: v4(),
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });

    tryToAddWrongProp(propositions, `\\frac{${a}}{\\sqrt(x)}`);
    tryToAddWrongProp(propositions, `${a}`);
    tryToAddWrongProp(propositions, `\\frac{${a}}{x}`);

    const missing = numOptions - propositions.length;
    for (let i = 0; i < missing; i++) {
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
            format: 'tex',
          };
        } else {
          proposition = {
            id: 'wrong' + i,
            statement: `\\frac{${randomA}}{2\\sqrt{x}}`,
            isRightAnswer: false,
            format: 'tex',
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
    answerFormat: 'tex',
  };

  return question;
}
