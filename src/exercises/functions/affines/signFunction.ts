import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  addValidProp,
  tryToAddWrongProp,
} from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

type QCMProps = {
  answer: string;
};
type VEAProps = {};
const getSignFunction: QuestionGenerator<QCMProps, VEAProps> = () => {
  const a = randint(-9, 10, [0]);
  const b = randint(-9, 10);
  const affine = new Polynomial([b, a]);

  let instruction = `Soit $f$ la fonction définie par : $f(x) = ${affine.toTex()}$. Sur quel intervalle $f$ est-elle `;
  let answer = '';

  switch (coinFlip()) {
    case true:
      instruction += 'positive ?';
      answer =
        a > 0
          ? `[${simplifyNode(new NumberNode(-b / a)).toTex()};+\\infty[`
          : `]-\\infty;${simplifyNode(new NumberNode(-b / a)).toTex()}]`;
      break;
    case false:
      instruction += 'négative ?';
      answer =
        a > 0
          ? `]-\\infty;${simplifyNode(new NumberNode(-b / a)).toTex()}]`
          : `[${simplifyNode(new NumberNode(-b / a)).toTex()};+\\infty[`;
      break;
  }

  const question: Question<QCMProps, VEAProps> = {
    instruction,
    startStatement: 'S',
    answer,
    keys: ['S', 'equal', 'lbracket', 'rbracket', 'semicolon', 'infty'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer },
  };
  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    const a = randint(-9, 10, [0]);
    const b = randint(-9, 10);
    const wrongAnswer = coinFlip()
      ? `[${simplifyNode(new NumberNode(-b / a)).toTex()};+\\infty[`
      : `]-\\infty;${simplifyNode(new NumberNode(-b / a)).toTex()}]`;

    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

export const signFunction: MathExercise<QCMProps, VEAProps> = {
  id: 'signFunction',
  connector: '=',
  label: "Signe d'une fonction affine",
  levels: ['3ème', '2nde', '2ndPro', '1rePro', '1reTech'],
  sections: ['Fonctions affines'],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getSignFunction, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
