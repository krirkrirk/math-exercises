import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';
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

type QCMProps = {
  answer: string;
};
type VEAProps = {};
const getAverageEvolutionRate: QuestionGenerator<QCMProps, VEAProps> = () => {
  const rate = randint(1, 100);
  const nbMois = randint(2, 13);

  const instruction = `Un prix augmente de $${rate}\\%$ en $${nbMois}$ mois. Quel est le taux d'évolution mensuel moyen ?`;
  const answer = round((Math.pow(1 + rate / 100, 1 / nbMois) - 1) * 100, 2);
  const answerTex = (answer + '').replace('.', ',') + `\\%`;
  const question: Question<QCMProps, VEAProps> = {
    instruction,
    answer: answerTex,
    keys: ['percent'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer: answerTex },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    let wrongAnswer = Number(answer.replace(',', '.').replace(`\\%`, ''));
    const deviation = Math.random() < 0.5 ? -1 : 1;
    const percentDeviation = Math.random() * 10 + 1;

    wrongAnswer += deviation * percentDeviation;
    wrongAnswer = round(wrongAnswer, 2);
    tryToAddWrongProp(propositions, `${wrongAnswer}\\%`);
  }

  return shuffle(propositions);
};

export const averageEvolutionRate: MathExercise<QCMProps, VEAProps> = {
  id: 'averageEvolutionRate',
  connector: '=',
  label: "Calculer un taux d'évolution moyen",
  levels: ['2nde', '1rePro', 'TermPro', '1reTech', 'TermTech'],
  sections: ['Pourcentages'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getAverageEvolutionRate, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
