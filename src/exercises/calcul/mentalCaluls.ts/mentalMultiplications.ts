import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { coinFlip } from '#root/utils/coinFlip';

export const mentalMultiplications: Exercise = {
  id: 'mentalMultiplications',
  connector: '=',
  instruction: 'Calculer.',
  label: 'Effectuer mentalement des multiplications simples',
  levels: ['6', '5', '4', '3', '2', '1', '0'],
  section: 'Calculs',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getMentalMultiplications, nb),
  keys: [],
};

export function getMentalMultiplications(): Question {
  const a = randint(-9, 10, [-1, 0, 1]);
  const b = coinFlip()
    ? randint(-99, 100, [-10, 0, 10]) / 10
    : coinFlip()
    ? randint(2, 10) * 10 + randint(-1, 2, [0])
    : randint(2, 10) + randint(-1, 2, [0]) / 10;

  const c = randint(2, 9, [3, 6, 7]);
  const d = randint(2, 11, [c]) / c;
  const f = coinFlip() ? randint(2, 10) / 10 : randint(2, 100) / 100;

  let numbers: number[] = [a, b, c, d, f];
  const allNumbersNodes = numbers.map((nb) => new NumberNode(nb));

  let statementTree;
  let answer: number;

  if (coinFlip()) {
    statementTree = new MultiplyNode(allNumbersNodes[0], allNumbersNodes[1]);
    answer = numbers[0] * numbers[1];
  } else {
    statementTree = new MultiplyNode(allNumbersNodes[2], new MultiplyNode(allNumbersNodes[3], allNumbersNodes[4]));
    answer = numbers[2] * numbers[3] * numbers[4];
  }

  statementTree.shuffle();

  const getPropositions = (n: number) => {
    const propositions: Proposition[] = [];
    for (let i = 0; i < n; i++) {
      let proposition = '';
      const incorrectAnswer = round(answer + (coinFlip() ? 1 : -1) * Math.random() * 10, 2);
      proposition = `${incorrectAnswer}`;
      propositions.push({
        id: Math.random() + '',
        statement: proposition,
        isRightAnswer: false,
      });
    }
    return propositions;
  };

  const question: Question = {
    startStatement: statementTree.toTex(),
    answer: round(answer, 2) + '',
    keys: [],
    getPropositions,
  };

  return question;
}
