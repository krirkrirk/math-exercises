import {
  shuffleProps,
  MathExercise,
  Proposition,
  Question,
  QuestionGenerator,
  addValidProp,
  tryToAddWrongProp,
  QCMGenerator,
} from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { frenchify } from '#root/math/utils/latex/frenchify';
import { distinctRandTupleInt, randTupleInt } from '#root/math/utils/random/randTupleInt';
import { randint } from '#root/math/utils/random/randint';
import { average } from '#root/utils/average';
import { v4 } from 'uuid';

type QCMProps = {
  answer: string;
};
type VEAProps = {};

const getAveragePointQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const points = distinctRandTupleInt(4, 2, { from: -9, to: 10 });
  const tab = `
| | | | | |
|-|-|-|-|-|
|x|${points[0][0]}|${points[1][0]}|${points[2][0]}|${points[3][0]}|
|y|${points[0][1]}|${points[1][1]}|${points[2][1]}|${points[3][1]}|
  `;
  const instruction = `On considère la liste de points suivante : ${tab}
  
  Déterminer les coordonnées du point moyen $G$.
  `;
  const xG = frenchify(average(points.map((el) => el[0])) + '');
  const yG = frenchify(average(points.map((el) => el[1])) + '');
  const answer = `\\left(${xG};${yG}\\right)`;

  const question: Question<QCMProps, VEAProps> = {
    answer,
    instruction,
    keys: ['semicolon'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    const wrongAnswer = `\\left(${frenchify(randint(-9, 10) + '')};${frenchify(randint(-9, 10) + '')}\\right)`;
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffleProps(propositions, n);
};

export const averagePoint: MathExercise<QCMProps, VEAProps> = {
  id: 'averagePoint',
  connector: '=',
  label: 'Déterminer le point moyen',
  levels: ['1rePro', '1reTech', 'TermTech', 'TermPro', 'MathComp'],
  isSingleStep: true,
  sections: ['Statistiques'],
  generator: (nb: number) => getDistinctQuestions(getAveragePointQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
