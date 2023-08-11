import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { DivideNode } from '#root/tree/nodes/operators/divideNode';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const mentalDivisions: Exercise = {
  id: 'mentalDivisions',
  connector: '=',
  instruction: 'Calculer.',
  label: 'Effectuer mentalement des divisions simples',
  levels: ['6', '5', '4', '3', '2', '1', '0'],
  section: 'Calculs',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getMentalDivisions, nb),
  keys: [],
};

export function getMentalDivisions(): Question {
  let a = 1,
    b = 1,
    c = 1;
  const rand = randint(1, 7);

  switch (rand) {
    case 1: // random / 10 ou random / 100
      a = randint(1, 100);
      b = coinFlip() ? 10 : 100;
      break;

    case 2: // ex : 0.28 / 0.7 ou 0.6 / 0.2
      b = randint(1, 10) / 10;
      a = coinFlip() ? round((b * randint(2, 10)) / 10, 2) : round(b * randint(2, 10), 1);
      break;

    case 3: // ex : 25 / 50
      b = randint(1, 10) * 10;
      a = (b / 10) * randint(-9, 10, [-1, 0, 1]);
      break;

    case 4: // ex : ex : 55 / 1.1
      b = randint(1, 16) / 10;
      a = b * randint(2, 10) * 10;
      a = round(a, 0);
      break;

    case 5: // ex : 5.6 / -7
      b = randint(-9, 10, [-1, 0, 1]);
      a = round((Math.abs(b) / 10) * randint(2, 10), 1);
      break;

    case 6: // ex 24 / (12 / 2)
      c = randint(1, 10);
      b = c * randint(2, 10);
      a = (b / c) * randint(2, 10);
      break;
  }

  const allNumbersNodes =
    rand === 6 ? [a, b, c].map((nb) => new NumberNode(nb)) : [a, b].map((nb) => new NumberNode(nb));
  const statementTree =
    rand === 6
      ? new DivideNode(allNumbersNodes[0], new DivideNode(allNumbersNodes[1], allNumbersNodes[2]))
      : new DivideNode(allNumbersNodes[0], allNumbersNodes[1]);
  const answer = rand === 6 ? a / (b / c) : a / b;

  const getPropositions = (n: number) => {
    const propositions: Proposition[] = [];

    // Ajout de la réponse correcte
    propositions.push({
      id: v4() + '',
      statement: answer.toString(),
      isRightAnswer: true,
    });

    // Ajout des propositions incorrectes
    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const incorrectAnswer = round(answer + (coinFlip() ? 1 : -1) * Math.random() * 10, 2);
        proposition = {
          id: v4() + '',
          statement: incorrectAnswer.toString(),
          isRightAnswer: false,
        };

        isDuplicate = propositions.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      propositions.push(proposition);
    }

    // Mélange des propositions
    return shuffle(propositions);
  };

  const question: Question = {
    startStatement: statementTree.toTex(),
    answer: round(answer, 2) + '',
    keys: [],
    getPropositions,
  };

  return question;
}
