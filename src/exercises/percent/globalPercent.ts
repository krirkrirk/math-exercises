import { randint } from '#root/math/utils/random/randint';
import { round } from 'mathjs';
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
import { shuffle } from '#root/utils/shuffle';

type QCMProps = {
  answer: string;
};
type VEAProps = {};

const getGlobalPercentQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const tab = ['hausse', 'baisse'];
  let ans = 1;
  let instruction = "Le prix d'un article subit une ";
  const indice = randint(2, 4);

  for (let i = 0; i < indice; i++) {
    const randPercent = randint(1, 50);
    let a = randint(0, 2);
    instruction += `${tab[a]} de $${randPercent}\\%$`;

    if (i + 1 < indice) instruction += ', puis une ';

    if (a == 0) ans *= 1 + randPercent / 100;
    else ans *= 1 - randPercent / 100;
  }

  ans = round((ans - 1) * 100, 2);

  instruction += ". \nDéterminer le taux d'évolution global du prix de cet article.";
  const answer = `${(ans + '').replace('.', ',')}\\%`;

  const question: Question<QCMProps, VEAProps> = {
    instruction,
    answer,
    keys: ['percent'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    let wrongAnswer = Number(answer.replace(',', '.').replace(`\\%`, ''));
    const deviation = Math.random() < 0.5 ? -1 : 1;
    const percentDeviation = Math.random() * 20 + 1;

    wrongAnswer += deviation * percentDeviation;
    wrongAnswer = round(wrongAnswer, 2);
    tryToAddWrongProp(propositions, `${wrongAnswer} \\%`);
  }

  return shuffle(propositions);
};

export const globalPercent: MathExercise<QCMProps, VEAProps> = {
  id: 'globalPercent',
  connector: '=',
  label: "Calculer un taux d'évolution global à partir de taux d'évolution successifs",
  levels: ['2nde', '1rePro', 'TermPro', '1reTech', 'TermTech'],
  sections: ['Pourcentages'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getGlobalPercentQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
