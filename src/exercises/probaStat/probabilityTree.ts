import { randint } from '#root/math/utils/random/randint';
import { Node } from '#root/tree/nodes/node';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';
import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  addValidProp,
  tryToAddWrongProp,
} from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';

function pgcd(a: number, b: number): number {
  while (b) [a, b] = [b, a % b];
  return a;
}

type GetAnswerNodeProps = {
  type: number;
  A: number;
  B: number;
  AC: number;
  AD: number;
  BC: number;
  BD: number;
};

type QCMProps = {
  answer: string;
} & GetAnswerNodeProps;

const getAnswerNode = ({ type, A, B, AC, AD, BC, BD }: GetAnswerNodeProps) => {
  const pA = simplifyNode(new NumberNode(A / (A + B)));
  const pB = simplifyNode(new NumberNode(B / (A + B)));

  const pA_C = simplifyNode(new NumberNode(AC / (AC + AD)));
  const pA_D = simplifyNode(new NumberNode(AD / (AC + AD)));
  const pB_C = simplifyNode(new NumberNode(BC / (BC + BD)));
  const pB_D = simplifyNode(new NumberNode(BD / (BC + BD)));
  switch (type) {
    case 1:
      return simplifyNode(new MultiplyNode(pA, pA_C));

    case 2:
      return simplifyNode(new MultiplyNode(pA, pA_D));

    case 3:
      return simplifyNode(new MultiplyNode(pB, pB_C));

    case 4:
    default:
      return simplifyNode(new MultiplyNode(pB, pB_D));
  }
};

const getProbabilityTree: QuestionGenerator<QCMProps, VEAProps> = () => {
  const A = randint(2, 9);
  const B = randint(2, 10 - A);
  const AC = randint(2, 9);
  const AD = randint(2, 10 - AC);
  const BC = randint(2, 9);
  const BD = randint(2, 10 - BC);

  let instruction = `En utilisant l'arbre de probabilité suivant, `;
  let startStatement = '';

  const type = randint(1, 5);
  const answer = getAnswerNode({ type, A, AC, AD, B, BC, BD });
  const answerTex = answer.toTex();
  switch (type) {
    case 1: {
      instruction += `$\\\\$ Calculer $P(A \\cap C)$`;
      startStatement = `P(A \\cap C)`;
      break;
    }
    case 2: {
      instruction += `$\\\\$ Calculer $P(A \\cap D)$`;
      startStatement = `P(A \\cap D)`;
      break;
    }
    case 3: {
      instruction += `$\\\\$ Calculer $P(B \\cap C)$`;
      startStatement = `P(B \\cap C)`;
      break;
    }
    case 4: {
      instruction += `$\\\\$ Calculer $P(B \\cap D)$`;
      startStatement = `P(B \\cap D)`;
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
    `Text("\\scriptsize ${A / pgcd(A, A + B)}/${(A + B) / pgcd(A, A + B)}", (0.3, 2.1), true, true)`,
    `Text("\\scriptsize ${AC / pgcd(AC, AC + AD)}/${(AC + AD) / pgcd(AC, AC + AD)}", (2.8, 3.5), true, true)`,
    `Text("\\scriptsize ${AD / pgcd(AD, AC + AD)}/${(AC + AD) / pgcd(AD, AC + AD)}", (2.8, 1.4), true, true)`,
    `Text("\\scriptsize ${B / pgcd(B, A + B)}/${(A + B) / pgcd(B, A + B)}", (0.3, -1.2), true, true)`,
    `Text("\\scriptsize ${BC / pgcd(BC, BC + BD)}/${(BC + BD) / pgcd(BC, BC + BD)}", (2.8, -0.6), true, true)`,
    `Text("\\scriptsize ${BD / pgcd(BD, BC + BD)}/${(BC + BD) / pgcd(BD, BC + BD)}", (2.8, -2.5), true, true)`,
    'Text("A", (1.85 , 2.5))',
    'Text("B", (1.85 , -2.8))',
    'Text("C", (5.5 , 2.85))',
    'Text("D", (5.5 , 0.85))',
    'Text("C", (5.5 , -1.1))',
    'Text("D", (5.5 , -3.1))',
  ];

  const question: Question<QCMProps, VEAProps> = {
    instruction,
    startStatement,
    answer: answerTex,
    keys: [],
    commands,
    coords: [-2, 8, -5, 5],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer: answerTex, A, AC, AD, B, BC, BD, type },
  };

  return question;
};

type VEAProps = {};
const getPropositions: QCMGenerator<QCMProps> = (n, { answer, A, AC, AD, B, BC, BD, type }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const answerNode = getAnswerNode({ A, AC, AD, B, BC, BD, type });
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, simplifyNode(new MultiplyNode(answerNode, new NumberNode(randint(2, 11)))).toTex());
  }

  return shuffle(propositions);
};

export const probabilityTree: MathExercise<QCMProps, VEAProps> = {
  id: 'probabilityTree',
  connector: '=',
  label: "Calculs de probabilités à l'aide d'un arbre pondéré",
  levels: ['2nde', '1reESM', '1reSpé', '1reTech', '1rePro', 'TermPro', 'TermTech'],
  isSingleStep: false,
  sections: ['Probabilités'],
  generator: (nb: number) => getDistinctQuestions(getProbabilityTree, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
