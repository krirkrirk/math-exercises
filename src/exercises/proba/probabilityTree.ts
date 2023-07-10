import { randint } from '#root/math/utils/random/randint';
import { Node } from '#root/tree/nodes/node';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';
import { Exercise, Proposition, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
import { v4 } from 'uuid';

export const probabilityTree: Exercise = {
  id: 'probabilityTree',
  connector: '=',
  instruction: '',
  label: "Calculs de probabilités à l'aide d'un arbre pondéré",
  levels: ['1', '0'],
  isSingleStep: false,
  section: 'Probabilités',
  generator: (nb: number) => getDistinctQuestions(getProbabilityTree, nb),
};

function pgcd(a: number, b: number): number {
  while (b) [a, b] = [b, a % b];
  return a;
}

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
  let answer: Node;

  const rand = randint(1, 5);

  switch (rand) {
    case 1: {
      instruction += `$\\\\$ Calculer $P(A \\cap C)$`;
      startStatement = `P(A \\cap C)`;
      answer = simplifyNode(new MultiplyNode(pA, pA_C));
      break;
    }
    case 2: {
      instruction += `$\\\\$ Calculer $P(A \\cap D)$`;
      startStatement = `P(A \\cap D)`;
      answer = simplifyNode(new MultiplyNode(pA, pA_D));
      break;
    }
    case 3: {
      instruction += `$\\\\$ Calculer $P(B \\cap C)$`;
      startStatement = `P(B \\cap C)`;
      answer = simplifyNode(new MultiplyNode(pB, pB_C));
      break;
    }
    case 4: {
      instruction += `$\\\\$ Calculer $P(B \\cap D)$`;
      startStatement = `P(B \\cap D)`;
      answer = simplifyNode(new MultiplyNode(pB, pB_D));
      break;
    }
    default:
      answer = simplifyNode(new MultiplyNode(pB, pB_D)); // juste pour éviter l'erreur
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
    `Text("\\scriptsize${A / pgcd(A, A + B)}/${(A + B) / pgcd(A, A + B)}", (0.3, 2.1), true, true)`,
    `Text("\\scriptsize${AC / pgcd(AC, AC + AD)}/${(AC + AD) / pgcd(AC, AC + AD)}", (2.8, 3.5), true, true)`,
    `Text("\\scriptsize${AD / pgcd(AD, AC + AD)}/${(AC + AD) / pgcd(AD, AC + AD)}", (2.8, 1.4), true, true)`,
    `Text("\\scriptsize${B / pgcd(B, A + B)}/${(A + B) / pgcd(B, A + B)}", (0.3, -1.2), true, true)`,
    `Text("\\scriptsize${BC / pgcd(BC, BC + BD)}/${(BC + BD) / pgcd(BC, BC + BD)}", (2.8, -0.6), true, true)`,
    `Text("\\scriptsize${BD / pgcd(BD, BC + BD)}/${(BC + BD) / pgcd(BD, BC + BD)}", (2.8, -2.5), true, true)`,
    'Text("A", (1.85 , 2.5))',
    'Text("B", (1.85 , -2.8))',
    'Text("C", (5.5 , 2.85))',
    'Text("D", (5.5 , 0.85))',
    'Text("C", (5.5 , -1.1))',
    'Text("D", (5.5 , -3.1))',
  ];

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: answer.toTex(),
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        proposition = {
          id: v4() + '',
          statement: simplifyNode(new MultiplyNode(answer, new NumberNode(randint(2, 11)))).toTex(),
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
    answer: answer.toTex(),
    keys: [],
    commands,
    coords: [-2, 8, -5, 5],
    getPropositions,
  };

  return question;
}
