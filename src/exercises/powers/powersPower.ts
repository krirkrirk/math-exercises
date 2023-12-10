/**
 * (a^b)^c
 */

import { Power } from '#root/math/numbers/integer/power';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { shuffle } from '#root/utils/shuffle';
import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
type QCMProps = {
  answer: string;
  a: number;
  b: number;
  c: number;
};
type VEAProps = {};

const getPowersPowerQuestion: QuestionGenerator<QCMProps, VEAProps, { useOnlyPowersOfTen: boolean }> = (opts) => {
  const a = opts?.useOnlyPowersOfTen ? 10 : randint(-11, 11, [0, 1]);
  const [b, c] = [1, 2].map((el) => randint(-11, 11));

  const statement = new PowerNode(new PowerNode(new NumberNode(a), new NumberNode(b)), new NumberNode(c));
  let answerTree = new Power(a, b * c).simplify();
  const answer = answerTree.toTex();
  const statementTex = statement.toTex();
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Calculer : $${statementTex}$`,

    startStatement: statementTex,
    answer,
    keys: [],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, a, b, c },
  };
  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, a, b, c }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  if (a === 1 || a === 0 || a === -1) {
    tryToAddWrongProp(propositions, '1');
    tryToAddWrongProp(propositions, '-1');
    tryToAddWrongProp(propositions, '0');
    tryToAddWrongProp(propositions, b * c + '');
    tryToAddWrongProp(propositions, b + c + '');
  }

  while (propositions.length < n) {
    const wrongExponent = b * c + randint(-11, 11, [0]);
    const wrongAnswerTree = new Power(a, wrongExponent).simplify();
    const wrongAnswer = wrongAnswerTree.toTex();
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffleProps(propositions, n);
};

export const powersOfTenPower: MathExercise<QCMProps, VEAProps> = {
  id: 'powersOfTenPower',
  connector: '=',
  label: "Puissance d'une puissance de 10 ",
  levels: ['4ème', '3ème', '2nde', 'CAP', '2ndPro', '1reESM', '1rePro', '1reSpé', '1reTech', 'TermPro', 'TermTech'],
  sections: ['Puissances'],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(() => getPowersPowerQuestion({ useOnlyPowersOfTen: true }), nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};

export const powersPower: MathExercise<QCMProps, VEAProps> = {
  id: 'powersPower',
  connector: '=',
  label: "Puissance d'une puissance",
  levels: ['4ème', '3ème', '2nde'],
  sections: ['Puissances'],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(() => getPowersPowerQuestion({ useOnlyPowersOfTen: true }), nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
