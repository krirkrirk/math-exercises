import { randint } from '#root/math/utils/random/randint';
import { Exercise, Proposition, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
import { round } from '#root/math/utils/round';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const conditionalProbability: Exercise = {
  id: 'conditionalProbability',
  connector: '=',
  instruction: '',
  label: 'Calcul de probabilité conditionnelle avec la formule de Bayes',
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
      instruction += `$P(A) = ${(pA / 100 + '').replace('.', ',')}\\ $ et $\\ P(A \\cap B) = ${(pAB / 100 + '').replace(
        '.',
        ',',
      )}$.$\\\\$Déterminer $P_A(B)$.`;
      startStatement = `P_A(B)`;
      answer = `${pB_A}`;
      break;
    }
    case 2: {
      instruction += `$P(B) = ${(pB / 100 + '').replace('.', ',')}\\ $ et $\\ P(B \\cap A) = ${(pAB / 100 + '').replace(
        '.',
        ',',
      )}$.$\\\\$Déterminer $P_B(A)$.`;
      startStatement = `P_B(A)`;
      answer = `${pA_B}`;
      break;
    }
    case 3: {
      instruction += `$P(A) = ${(pA / 100 + '').replace('.', ',')}\\ $ et $\\ P_A(B) = ${(pB_A + '').replace(
        '.',
        ',',
      )}$.$\\\\$Déterminer $P(A \\cap B)$.`;
      startStatement = `P(A \\cap B)`;
      answer = `${pAB / 100}`;
      break;
    }
    case 4: {
      instruction += `$P(B) = ${(pB / 100 + '').replace('.', ',')}\\ $ et $\\ P_B(A) = ${(pA_B + '').replace(
        '.',
        ',',
      )}$.$\\\\$Déterminer $P(A \\cap B)$.`;
      startStatement = `P(A \\cap B)`;
      answer = `${pAB / 100}`;
      break;
    }
    case 5: {
      instruction += `$P(A \\cap B) = ${(pAB / 100 + '').replace('.', ',')}\\ $ et $\\ P_B(A) = ${(pA_B + '').replace(
        '.',
        ',',
      )}$.$\\\\$Déterminer $P(B)$.`;
      startStatement = `P(B)`;
      answer = `${pB / 100}`;
      break;
    }
    case 6: {
      instruction += `$P(A \\cap B) = ${(pAB / 100 + '').replace('.', ',')}\\ $ et $\\ P_A(B) = ${(pB_A + '').replace(
        '.',
        ',',
      )}$.$\\\\$Déterminer $P(A)$.`;
      startStatement = `P(A)`;
      answer = `${pA / 100}`;
      break;
    }
  }

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: answer,
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        proposition = {
          id: v4() + '',
          statement: Math.floor(Math.random() * 100) / 100 + '',
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction,
    startStatement,
    answer,
    keys: ['p', 'cap', 'underscore'],
    getPropositions,
  };

  return question;
}
