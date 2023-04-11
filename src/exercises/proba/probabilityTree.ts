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
  const A = randint(4, 9);
  const B = randint(4, 10 - A);

  const pA = simplifyNode(new NumberNode(A / (A + B)));
  const pB = simplifyNode(new NumberNode(B / (A + B)));

  const pA_C = simplifyNode(new NumberNode((A - 1) / (A + B - 1)));
  const pA_D = simplifyNode(new NumberNode(B / (A + B - 1)));
  const pB_C = simplifyNode(new NumberNode(A / (A + B - 1)));
  const pB_D = simplifyNode(new NumberNode((B - 1) / (A + B - 1)));

  let instruction = `$P(A) = ${pA.toTex()}, P(B) = ${pB.toTex()}$.$\\\\$ $P_A(C) = ${pA_C.toTex()}, P_A(D) = ${pA_D.toTex()}, P_B(C) = ${pB_C.toTex()}, P_B(D) = ${pB_D.toTex()}$.`;
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

  const question: Question = {
    instruction,
    startStatement,
    answer,
  };

  return question;
}
