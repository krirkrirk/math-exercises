import { Exercise, Question } from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";

export const fractionToPercentToDecimal: Exercise = {
    id: 'fractionToPercentToDecimal',
    connector: '\\iff',
    instruction: '',
    label: 'Résoudre une équation du premier degré du type ax + b = cx',
    levels: ['2', '1'],
    section: 'Pourcentages',
    isSingleStep: false,
    generator: (nb: number) => getDistinctQuestions(getFractionToPercentToDecimal, nb),
};

const pgcd = (a: number, b: number): number => {
    if (b === 0)
      return a;
    return pgcd(b, a % b);
}

export function getFractionToPercentToDecimal(): Question {

    const a = randint(1, 100);
    const b = randint(1, 100);
    const percent = round(a/b, 4) * 100;
    const decimal = round(a/b, 2);
    const flip = randint(1,4);

    let instruction;
    let answer = "";

    switch (flip){
        case 1: {
            instruction = `Convertir le nombre suivant $${decimal}$ en pourcentage et en fraction`;
            answer = `\\{${percent}\\%\\ ; \\frac{${a/pgcd(a,b)}}{${b/pgcd(a,b)}}\\}`;
        }
    }

    const question: Question = {
        instruction,
        startStatement: `s = `,
        answer,
      };

      return question;
}