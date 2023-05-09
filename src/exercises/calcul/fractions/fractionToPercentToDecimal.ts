import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { simplifyNode } from '#root/tree/parsers/simplify';

export const fractionToPercentToDecimal: Exercise = {
  id: 'fractionToPercentToDecimal',
  connector: '\\iff',
  instruction: '',
  label: "Passer d'une écriture d'un nombre à une autre",
  levels: ['2', '1'],
  section: 'Fractions',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getFractionToPercentToDecimal, nb),
};

export function getFractionToPercentToDecimal(): Question {
  const denominator = 2 ** randint(0, 5) * 5 ** randint(0, 5);
  const numerator = denominator !== 1 ? randint(1, denominator) : randint(1, 100);

  const fraction = new FractionNode(new NumberNode(numerator), new NumberNode(denominator));
  const decimal = numerator / denominator;
  const percent = round((numerator / denominator) * 100, 2);

  const rand = randint(1, 7);
  let instruction;
  let answer = '';

  switch (rand) {
    case 1: {
      instruction = `Écrire le nombre $${decimal}$ sous forme de pourcentage.`;
      answer = `${percent}\\%`;
      break;
    }
    case 2: {
      instruction = `Écrire le nombre $${decimal}$ sous forme de fraction.`;
      answer = `${simplifyNode(fraction).toTex()}`;
      break;
    }
    case 3: {
      instruction = `Écrire le nombre $${percent}\\%$ sous forme décimale.`;
      answer = `${decimal}`;
      break;
    }
    case 4: {
      instruction = `Écrire le nombre $${percent}\\%$ sous forme de fraction.`;
      answer = `${simplifyNode(fraction).toTex()}`;
      break;
    }
    case 5: {
      instruction = `Écrire le nombre $${fraction.toTex()}$ sous forme décimale.`;
      answer = `${decimal}`;
      break;
    }
    case 6: {
      instruction = `Écrire le nombre $${fraction.toTex()}$ sous forme de pourcentage.`;
      answer = `${percent}\\%`;
      break;
    }
  }

  const question: Question = {
    instruction,
    //startStatement: `${numerator} et ${denominator}`,
    answer,
    keys: ['percent'],
  };

  return question;
}
