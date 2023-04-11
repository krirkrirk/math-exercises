import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';
import { Exercise, Question } from '../../exercise';
import { getDistinctQuestions } from '../../utils/getDistinctQuestions';

export const usualDerivative: Exercise = {
  id: 'usualDerivative',
  connector: '=',
  instruction: '',
  label: 'Dérivées usuelles',
  levels: ['1', '0'],
  section: 'Dérivation',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getUsualDerivative, nb),
};

export function getUsualDerivative(): Question {
  const a = randint(-10, 10, [0]);
  const b = randint(-10, 10);
  const c = randint(-10, 10);
  const flip = randint(1, 6);

  let instruction = `Déterminer la fonction dérivée $f'$ de la fonction $f$ définie par $f(x) =$ `;
  let answer = '';

  switch (flip) {
    case 1: {
      // f(x) = c
      instruction += `$${c}$`;
      answer = `0`;
      break;
    }
    case 2: {
      // f(x) = ax + b
      instruction += `$${new Polynomial([b, a]).toString()}$`;
      answer = `${a}`;
      break;
    }
    case 3: {
      // f(x) = ax² + bx + c
      instruction += `$${new Polynomial([c, b, a]).toString()}$`;
      answer = `${new Polynomial([b, 2 * a]).toString()}`;
      break;
    }
    case 4: {
      //f(x) = a/x
      instruction += `$\\frac{${a}}{x}$`;
      answer = `\\frac{${-a}}{x^2}`;
      break;
    }
    case 5: {
      // f(x) = a * sqrt(x)
      if (a === 1) instruction += `$\\sqrt{x}$`;
      else if (a === -1) instruction += `$-\\sqrt{x}$`;
      else instruction += `$${a}\\sqrt{x}$`;

      if (a / 2 === round(a / 2, 0)) answer = `\\frac{${a / 2}}{\\sqrt{x}}`;
      else answer = `\\frac{${a}}{2\\sqrt{x}}`;
      break;
    }
  }

  const question: Question = {
    instruction,
    startStatement: `f'(x)`,
    answer,
    keys: ['x'],
  };

  return question;
}
