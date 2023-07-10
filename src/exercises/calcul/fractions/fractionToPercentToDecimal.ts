import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';
import { v4 as uuidv4 } from 'uuid';

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
      instruction = `Écrire le nombre $${String(decimal).replace('.', ',')}$ sous forme de pourcentage.`;
      answer = `${percent}\\%`;
      break;
    }
    case 2: {
      instruction = `Écrire le nombre $${String(decimal).replace('.', ',')}$ sous forme de fraction.`;
      answer = `${simplifyNode(fraction).toTex()}`;
      break;
    }
    case 3: {
      instruction = `Écrire le nombre $${String(percent).replace('.', ',')}\\%$ sous forme décimale.`;
      answer = `${decimal}`;
      break;
    }
    case 4: {
      instruction = `Écrire le nombre $${String(percent).replace('.', ',')}\\%$ sous forme de fraction.`;
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

  const getPropositions = (n: number) => {
    const propositions: Proposition[] = [];

    propositions.push({
      id: uuidv4(),
      statement: answer,
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        let statement: string = '';

        switch (rand) {
          case 1:
            const temp1 = randint(-5, 3, [0]);
            statement = `${round(percent * 10 ** temp1, -temp1 + 2)}\\%`;
            break;
          case 2:
            statement = `${simplifyNode(
              new FractionNode(
                new NumberNode(numerator * randint(1, 20, [0, 1])),
                new NumberNode(denominator * randint(1, 20, [0, 1])),
              ),
            ).toTex()}`;
            break;
          case 3:
            const temp3 = randint(-5, 3, [0]);
            statement = `${round(percent * 10 ** temp3, -temp3 + 2)}`;
            break;
          case 4:
            statement = `${simplifyNode(
              new FractionNode(
                new NumberNode(numerator * randint(1, 20, [0, 1])),
                new NumberNode(denominator * randint(1, 20, [0, 1])),
              ),
            ).toTex()}`;
            break;
          case 5:
            statement = `${round(decimal + Math.random() * 10, 2)}`;
            break;
          case 6:
            statement = `${round(percent + Math.random() * 10, 2)}\\%`;
            break;
        }

        proposition = {
          id: uuidv4(),
          statement,
          isRightAnswer: false,
        };

        isDuplicate = propositions.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      propositions.push(proposition);
    }

    return shuffle(propositions);
  };

  const question: Question = {
    instruction,
    answer,
    keys: ['percent'],
    getPropositions,
  };

  return question;
}
