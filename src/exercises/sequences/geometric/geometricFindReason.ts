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
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';

type QCMProps = {
  answer: string;
  value1: number;
  value2: number;
};
type VEAProps = {};

const getGeometricFindReason: QuestionGenerator<QCMProps, VEAProps> = () => {
  const rank1 = randint(0, 10);
  const rank2 = rank1 + 1;
  const reason = randint(2, 10);
  const value1 = randint(1, 10);
  const value2 = reason * value1;

  const answer = reason.toString();
  const question: Question<QCMProps, VEAProps> = {
    instruction: `$(u_n)$ est une suite géométrique. On sait que $u_{${rank1}} = ${value1}$ et $u_{${rank2}} = ${value2}$. Quelle est la raison de la suite $(u_n)$ ?`,
    startStatement: 'q',
    answer,
    keys: ['q', 'n', 'u', 'underscore'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, value1, value2 },
  };
  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, value1, value2 }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  if (value2 - value1 !== 2) tryToAddWrongProp(propositions, value2 - value1 + '');

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, Number(answer) + randint(1, 10) + '');
  }

  return shuffle(propositions);
};

export const geometricFindReason: MathExercise<QCMProps, VEAProps> = {
  id: 'geometricFindReason',
  connector: '=',
  label: "Déterminer la raison d'une suite géométrique",
  levels: ['1reESM', '1reSpé', '1reTech', '1rePro', 'TermTech', 'TermPro'],
  sections: ['Suites'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getGeometricFindReason, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
