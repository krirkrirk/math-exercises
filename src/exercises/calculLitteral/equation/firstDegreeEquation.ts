import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Rational } from '#root/math/numbers/rationals/rational';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

type QCMProps = {
  answer: string;
  a: number;
  b: number;
};
type VEAProps = {};

const getFirstDegreeEquation: QuestionGenerator<QCMProps, VEAProps> = () => {
  const a = randint(-30, 30, [0]);
  const b = randint(-30, 30, [0]);
  const answer = `x=${new Rational(a, b).simplify().toTree().toTex()}`;
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Résoudre l'équation suivante : $\\frac{${a}}{x} = ${b}$`,
    startStatement: `x`,
    answer,
    keys: ['x', 'S', 'equal', 'lbrace', 'rbrace', 'semicolon', 'emptyset'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, a, b },
  };

  return question;
};
const getPropositions: QCMGenerator<QCMProps> = (n, { answer, a, b }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, `x=${simplifyNode(new NumberNode(b / a)).toTex()}`);
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      `x=${simplifyNode(new NumberNode((a + randint(-7, 8, [-a])) / (b + randint(-7, 8, [-b])))).toTex()}`,
    );
  }

  return shuffle(propositions);
};

export const firstDegreeEquation: MathExercise<QCMProps, VEAProps> = {
  id: 'firstDegreeEquation',
  connector: '=',
  label: 'Résoudre une équation du premier degré du type $\\frac{a}{x} = b$',
  levels: ['2nde', '1reESM', '1reSpé'],
  sections: ['Équations'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getFirstDegreeEquation, nb),
  getPropositions,
  qcmTimer: 60,
  freeTimer: 60,
};
