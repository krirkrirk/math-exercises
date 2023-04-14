import { randint } from '#root/math/utils/random/randint';
import { Exercise, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
import { round } from '#root/math/utils/round';

export const conditionalProbability: Exercise = {
  id: 'conditionalProbability',
  connector: '=',
  instruction: '',
  label: 'Calcul de probabilité conditionnelle avec la formule',
  levels: ['1', '0'],
  isSingleStep: false,
  section: 'Probabilités',
  generator: (nb: number) => getDistinctQuestions(getConditionalProbability, nb),
  keys: ['p', 'cap', 'underscore'],
};

export function getConditionalProbability(): Question {
  const pA = randint(2, 100);
  const pB = randint(2, 100);
  const pAB = randint(1, Math.min(pA, pB));
  const pA_B = round(pAB / pB, 2);
  const pB_A = round(pAB / pA, 2);

  const flip = randint(1, 7);

  let instruction = `On considère deux événements A et B tels que `;
  let startStatement = '';
  let answer = '';

  switch (flip) {
    case 1: {
      instruction += `$p(A) = ${pA / 100}, p(A \\cap B) = ${pAB / 100}$.$\\\\$Déterminer $p_A(B)$.`;
      startStatement = `p_A(B)`;
      answer = `${pB_A}`;
      break;
    }
    case 2: {
      instruction += `$p(B) = ${pB / 100}, p(B \\cap A) = ${pAB / 100}$.$\\\\$Déterminer $p_B(A)$.`;
      startStatement = `p_B(A)`;
      answer = `${pA_B}`;
      break;
    }
    case 3: {
      instruction += `$p(A) = ${pA / 100}, p_A(B) = ${pB_A}$.$\\\\$Déterminer $p(A \\cap B)$.`;
      startStatement = `p(A \\cap B)`;
      answer = `${pAB / 100}`;
      break;
    }
    case 4: {
      instruction += `$p(B) = ${pB / 100}, p_B(A) = ${pA_B}$.$\\\\$Déterminer $p(A \\cap B)$.`;
      startStatement = `p(A \\cap B)`;
      answer = `${pAB / 100}`;
      break;
    }
    case 5: {
      instruction += `$p(A \\cap B) = ${pAB / 100}, p_B(A) = ${pA_B}$.$\\\\$Déterminer $p(B)$.`;
      startStatement = `p(B)`;
      answer = `${pB / 100}`;
      break;
    }
    case 6: {
      instruction += `$p(A \\cap B) = ${pAB / 100}, p_A(B) = ${pB_A}$.$\\\\$Déterminer $p(A)$.`;
      startStatement = `p(A)`;
      answer = `${pA / 100}`;
      break;
    }
  }

  const question: Question = {
    instruction,
    startStatement,
    answer,
    keys: ['p', 'cap', 'underscore'],
  };

  return question;
}
