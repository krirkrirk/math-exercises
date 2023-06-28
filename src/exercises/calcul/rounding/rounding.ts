import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { DecimalConstructor } from '#root/math/numbers/decimals/decimal';
import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

/**
 * arrondi à l'unité
 */
export const roundToUnit: Exercise = {
  id: 'roundToUnit',
  connector: '\\approx',
  instruction: "Arrondir à l'unité :",
  label: "Arrondir à l'unité",
  levels: ['6', '5'],
  section: 'Calculs',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(() => getRoundQuestions(0), nb),
  keys: [],
};
/**
 * arrondi à l'unité
 */
export const roundToDixieme: Exercise = {
  id: 'roundToDixieme',
  connector: '\\approx',
  instruction: 'Arrondir au dixième :',
  label: 'Arrondir au dixième',
  levels: ['6', '5'],
  section: 'Calculs',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(() => getRoundQuestions(1), nb),
};
/**
 * arrondi à l'unité
 */
export const roundToCentieme: Exercise = {
  id: 'roundToCentieme',
  connector: '\\approx',
  instruction: 'Arrondir au centième :',
  label: 'Arrondir au centième',
  levels: ['6', '5'],
  section: 'Calculs',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(() => getRoundQuestions(2), nb),
};
/**
 * arrondi à l'unité
 */
export const roundToMillieme: Exercise = {
  id: 'roundToMillieme',
  connector: '\\approx',
  instruction: 'Arrondir au millième :',
  label: 'Arrondir au millième',
  levels: ['6', '5'],
  section: 'Calculs',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(() => getRoundQuestions(3), nb),
};

export const allRoundings: Exercise = {
  id: 'allRoundings',
  connector: '\\approx',
  instruction: '',
  label: 'Arrondir un nombre décimal',
  levels: ['6', '5'],
  section: 'Calculs',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(() => getRoundQuestions(randint(0, 4)), nb),
};

const instructions = [
  "Arrondir à l'unité :",
  'Arrondir au dixième :',
  'Arrondir au centième :',
  'Arrondir au millième :',
];

export function getRoundQuestions(precisionAsked: number = 0): Question {
  const precision = randint(precisionAsked + 1, precisionAsked + 5);
  const dec = DecimalConstructor.random(0, 1000, precision);

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: dec.round(precisionAsked).toTree().toTex(),
      isRightAnswer: true,
    });

    res.push({
      id: v4() + '',
      statement:
        round(dec.value, precisionAsked) === round(dec.value + 0.5 * 10 ** -precisionAsked, precisionAsked)
          ? round(dec.value - 0.5 * 10 ** -precisionAsked, precisionAsked) + ''
          : round(dec.value + 0.5 * 10 ** -precisionAsked, precisionAsked) + '',
      isRightAnswer: false,
    });

    if (n > 2)
      res.push({
        id: v4() + '',
        statement: dec.toTree().toTex(),
        isRightAnswer: false,
      });

    if (n > 3 && dec.decimalPart.length !== precisionAsked + 1)
      res.push({
        id: v4() + '',
        statement: dec
          .round(precisionAsked + 1)
          .toTree()
          .toTex(),
        isRightAnswer: false,
      });

    for (let i = 0; dec.decimalPart.length !== precisionAsked + 1 ? i < n - 4 : i < n - 3; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        proposition = {
          id: v4() + '',
          statement: DecimalConstructor.random(0, 1000, precision).toTree().toTex(),
          isRightAnswer: false,
        };
        console.log(proposition);

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction: instructions[precisionAsked],
    startStatement: dec.toTree().toTex(),
    answer: dec.round(precisionAsked).toTree().toTex(),
    keys: [],
    getPropositions,
  };
  return question;
}
