import { Exercise, Question } from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";

export const firstDegreeGeneralEquation: Exercise = {
    id: 'firstDegreeGeneralEquation',
    connector: '\\iff',
    instruction: '',
    label: 'Résoudre une équation du premier degré du type ax + b = cx',
    levels: ['2', '1'],
    section: 'Pourcentages',
    isSingleStep: false,
    generator: (nb: number) => getDistinctQuestions(getFirstDegreeGeneralEquation, nb),
};


const pgcd = (a: number, b: number): number => {
    if (b === 0)
      return a;
    return pgcd(b, a % b);
}

export function getFirstDegreeGeneralEquation(): Question {

    let a = randint(-20, 20);
    const b = randint(-20, 20);
    const c = randint(-20, 20);

    while (a == 0 || a == 1)
        a = randint(-12, 12);

    const instruction = `Résoudre l'équation suivante $${a}x + ${b} = ${c}$`;
    let answer;

    if ((c-b)/a == round((c-b)/a, 0))
        answer = `${(c-b)/a}`;
    else
        answer = `\\frac{${(c-b)/pgcd((c-b),a)}}{${a/pgcd((c-b),a)}}`;

    const question: Question = {
      instruction,
      startStatement: `x = `,
      answer,
    };

    return question;
}