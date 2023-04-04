import { Polynomial } from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { Exercise, Question } from "../../exercise";
import { getDistinctQuestions } from "../../utils/getDistinctQuestions";

export const usualderivative: Exercise = {
    id: 'usualderivative',
    connector: '=',
    instruction: '',
    label: 'Dérivées usuelles',
    levels: ['2', '1'],
    section: 'Dérivées',
    isSingleStep: false,
    generator: (nb: number) => getDistinctQuestions(getUsualderivative, nb),
  };

export function getUsualderivative(): Question {

    const a = randint(-10, 10, [0]);
    const b = randint(-10, 10);
    const c = randint(-10, 10);
    const flip = randint (1,6);

    let instruction = `Déterminer la fonction dérivée $f'$ de la fonction $f$ définie par $f(x) =$ `;
    let answer ='';

    switch (flip){
        case 1: {
            instruction += `$${c}$`;
            answer = `0`;
            break;
        }
        case 2: {
            instruction += `$${new Polynomial([a, b]).toString()}$`;
            answer = `${a}`;
            break;
        }
        case 3: {
            instruction += `$${new Polynomial([a, b, c]).toString()}$`;
            answer = `${new Polynomial([2*a, b]).toString()}`;
            break;
        }
        case 4: {
            instruction += `$\\frac{${a}}{x}$`;
            answer = `\\frac{${-a}}{x^2}`;
            break;
        }
        case 5: {
            instruction += `$${a}\\sqrt{x}$`;
            if (a/2 === round(a/2, 0))
                answer = `\\frac{${a/2}}{\\sqrt{x}}`;
            else
                answer = `\\frac{${a}}{2\\sqrt{x}}`;
            break;
        }
    }

    const question: Question = {
        instruction,
        startStatement: `f'(x) = `,
        answer,
      };
    
      return question;
}