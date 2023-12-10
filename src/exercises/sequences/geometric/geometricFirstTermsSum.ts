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
  raison: number;
  final: number;
};
type VEAProps = {};

const getGeometricFirstTermsSumQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const raison = randint(2, 10);
  const final = randint(6, 15);
  const answer = (raison ** (final + 1) - 1) / (raison - 1);

  const question: Question<QCMProps, VEAProps> = {
    answer: answer + '',
    instruction: `Calculer la somme suivante : $1 + ${raison} + ${raison}^2 + \\ldots + ${raison}^{${final}}$`,
    keys: [],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer: answer + '', raison, final },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, raison, final }) => {
  const propositions: Proposition[] = [];

  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, (raison ** (final + 1) - 1).toString());
  tryToAddWrongProp(propositions, ((raison ** final - 1) / (raison - 1)).toString());

  while (propositions.length < n) {
    const wrongAnswer = randint(1000, 10000) + '';
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

export const geometricFirstTermsSum: MathExercise<QCMProps, VEAProps> = {
  id: 'geometricFirstTermsSum',
  connector: '=',
  label: "Somme des termes d'une suite géométrique",
  levels: ['1reESM', '1rePro', '1reSpé', '1reTech', 'TermPro', 'TermSpé', 'TermTech'],
  isSingleStep: true,
  sections: ['Suites'],
  generator: (nb: number) => getDistinctQuestions(getGeometricFirstTermsSumQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
