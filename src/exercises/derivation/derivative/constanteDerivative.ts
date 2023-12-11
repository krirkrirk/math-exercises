import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { NombreConstructor, NumberType } from '#root/math/numbers/nombre';
import { randint } from '#root/math/utils/random/randint';
import { OppositeNode } from '#root/tree/nodes/functions/oppositeNode';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

type QCMProps = {
  answer: string;
  tex: string;
};
type VEAProps = {};

export const getConstanteDerivative: QuestionGenerator<QCMProps, VEAProps> = () => {
  const c = NombreConstructor.random();
  const tex = c.toTree().toTex();
  const answer = '0';
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Déterminer la fonction dérivée $f'$ de la fonction $f$ définie par $f(x) = ${tex}$.`,
    startStatement: `f'(x)`,
    answer,
    keys: ['x'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, tex },
  };

  return question;
};

export const getConstanteDerivativePropositions: QCMGenerator<QCMProps> = (n, { answer, tex }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  tryToAddWrongProp(propositions, tex);
  tryToAddWrongProp(propositions, '1');
  const opposite = tex[0] === '-' ? tex.slice(1) : '-' + tex;
  tryToAddWrongProp(propositions, `${opposite}`);
  tryToAddWrongProp(propositions, 'x');

  while (propositions.length < n) {
    const wrongAnswer = randint(-9, 10);
    tryToAddWrongProp(propositions, wrongAnswer + '');
  }

  return shuffleProps(propositions, n);
};

export const constanteDerivative: MathExercise<QCMProps, VEAProps> = {
  id: 'constanteDerivative',
  connector: '=',
  label: "Dérivée d'une constante",
  levels: ['1reESM', '1reSpé', '1reTech', 'MathComp', '1rePro'],
  sections: ['Dérivation'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getConstanteDerivative, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions: getConstanteDerivativePropositions,
};
