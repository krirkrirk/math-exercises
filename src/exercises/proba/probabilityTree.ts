import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { Exercise, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';

export const probabilityTree: Exercise = {
  id: 'probabilityTree',
  connector: '=',
  instruction: '',
  label: 'Calculs dans un arbre pondéré',
  levels: ['1', '0'],
  isSingleStep: false,
  section: 'Probabilités',
  generator: (nb: number) => getDistinctQuestions(getProbabilityTree, nb),
};

export function getProbabilityTree(): Question {
  const A = randint(2, 9);
  const B = randint(2, 10 - A);
  const AC = randint(2, 9);
  const AD = randint(2, 10 - AC);
  const BC = randint(2, 9);
  const BD = randint(2, 10 - BC);

  const pA = simplifyNode(new NumberNode(A / (A + B)));
  const pB = simplifyNode(new NumberNode(B / (A + B)));

  const pA_C = simplifyNode(new NumberNode(AC / (AC + AD)));
  const pA_D = simplifyNode(new NumberNode(AD / (AC + AD)));
  const pB_C = simplifyNode(new NumberNode(BC / (BC + BD)));
  const pB_D = simplifyNode(new NumberNode(BD / (BC + BD)));

  let instruction = `En utilisant l'arbre de probabilité suivant, `;
  let startStatement = '';
  let answer = '';

  const rand = randint(1, 5);

  switch (rand) {
    case 1: {
      instruction += `$\\\\$ Calculer $P(A \\cap C)$`;
      startStatement = `P(A \\cap C)`;
      answer = simplifyNode(new MultiplyNode(pA, pA_C)).toTex();
      break;
    }
    case 2: {
      instruction += `$\\\\$ Calculer $P(A \\cap D)$`;
      startStatement = `P(A \\cap D)`;
      answer = simplifyNode(new MultiplyNode(pA, pA_D)).toTex();
      break;
    }
    case 3: {
      instruction += `$\\\\$ Calculer $P(B \\cap C)$`;
      startStatement = `P(B \\cap C)`;
      answer = simplifyNode(new MultiplyNode(pB, pB_C)).toTex();
      break;
    }
    case 4: {
      instruction += `$\\\\$ Calculer $P(B \\cap D)$`;
      startStatement = `P(B \\cap D)`;
      answer = simplifyNode(new MultiplyNode(pB, pB_D)).toTex();
      break;
    }
  }

  let commands = [
    'A = Point({2,2})',
    'B = Point({2,-2})',
    'AC = Point({5,3})',
    'AD = Point({5,1})',
    'BC = Point({5,-1})',
    'BD = Point({5,-3})',
    'Segment(Point({0,0}),A)',
    'Segment(A,AC)',
    'Segment(A,AD)',
    'Segment(Point({0,0}),B)',
    'Segment(B,BC)',
    'Segment(B,BD)',
    'ShowAxes(false)',
    'ShowGrid(false)',
    `Text("\\scriptsize${pA.toTex()}", (0.5, 2.5), true, true)`,
    `Text("\\scriptsize${pA_C.toTex()}", (3, 4), true, true)`,
    `Text("\\scriptsize${pA_D.toTex()}", (3.2, 1.5), true, true)`,
    `Text("\\scriptsize${pB.toTex()}", (0.5, -1), true, true)`,
    `Text("\\scriptsize${pB_C.toTex()}", (2.8, 0), true, true)`,
    `Text("\\scriptsize${pB_D.toTex()}", (3, -2.5), true, true)`,
    'Text("A", (1.85 , 2.5))',
    'Text("B", (1.85 , -2.8))',
    'Text("C", (5.5 , 2.85))',
    'Text("D", (5.5 , 0.85))',
    'Text("C", (5.5 , -1.1))',
    'Text("D", (5.5 , -3.1))',
  ];

  const question: Question = {
    instruction,
    startStatement,
    answer,
    keys: [],
    commands,
    coords: [-2, 8, -5, 5],
  };

  return question;
}