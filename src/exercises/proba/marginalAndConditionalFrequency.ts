import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';
import { Exercise, Proposition, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
import { v4 } from 'uuid';

export const marginalAndConditionalFrequency: Exercise = {
  id: 'marginalAndConditionalFrequency',
  connector: '=',
  instruction: '',
  label: 'Calculs de fréquences marginales et conditionnelles',
  levels: ['1', '0'],
  isSingleStep: false,
  section: 'Probabilités',
  generator: (nb: number) => getDistinctQuestions(getMarginalAndConditionalFrequency, nb),
  keys: ['f', 'cap', 'underscore'],
};

export function getMarginalAndConditionalFrequency(): Question {
  const [x1, x2, x3, x4] = [1, 2, 3, 4].map((el) => randint(1, 100));
  const x = x1 + x2 + x3 + x4;
  const rand = randint(0, 12);

  const freqString = [
    'marginale de A',
    'marginale de B',
    'marginale de C',
    'marginale de D',
    'conditionnelle de A parmi C',
    'conditionnelle de A parmi D',
    'conditionnelle de B parmi C',
    'conditionnelle de B parmi D',
    'conditionnelle de C parmi A',
    'conditionnelle de C parmi B',
    'conditionnelle de D parmi A',
    'conditionnelle de D parmi B',
  ];

  const frequences = [
    'f(A)',
    'f(B)',
    'f(C)',
    'f(D)',
    'f_C(A)',
    'f_D(A)',
    'f_C(B)',
    'f_D(B)',
    'f_A(C)',
    'f_B(C)',
    'f_A(D)',
    'f_B(D)',
  ];

  const Calculs = [
    (x1 + x3) / x,
    (x2 + x4) / x,
    (x1 + x2) / x,
    (x3 + x4) / x,
    x1 / (x1 + x2),
    x3 / (x3 + x4),
    x2 / (x1 + x2),
    x4 / (x3 + x4),
    x1 / (x1 + x3),
    x3 / (x1 + x3),
    x2 / (x2 + x4),
    x4 / (x2 + x4),
  ];

  const calculsNodes = Calculs.map((el) => simplifyNode(new NumberNode(el)));

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: calculsNodes[rand].toTex(),
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        proposition = {
          id: v4() + '',
          statement: calculsNodes[randint(0, 12, [rand])].toTex(),
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction: `On considère le tableau d'effectifs suivant : 

| |A|B|
|-|-|-|
|C|${x1}|${x2}|
|D|${x3}|${x4}|

Calculer la fréquence ${freqString[rand]}.`,
    startStatement: `${frequences[rand]}`,
    answer: calculsNodes[rand].toTex(),
    keys: ['f', 'cap', 'underscore'],
    getPropositions,
  };

  return question;
}
