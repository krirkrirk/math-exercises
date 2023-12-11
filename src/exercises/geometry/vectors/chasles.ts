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
import { KeyId } from '#root/types/keyIds';
import { random } from '#root/utils/random';
import { shuffle } from '#root/utils/shuffle';

type QCMProps = {
  answer: string;
  randLetters: string[];
};
type VEAProps = {};

const letters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ';

const getChaslesQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const nbOfVectors = randint(2, 5);
  const randLetters = shuffle(letters.split('')).slice(0, nbOfVectors + 2);
  let vectors = [];
  for (let i = 0; i < nbOfVectors; i++) {
    vectors.push(`${randLetters[i]}${randLetters[i + 1]}`);
  }
  const answer = `\\overrightarrow{${randLetters[0]}${randLetters[nbOfVectors]}}`;
  const invVec = (vec: string) => {
    return `\\overrightarrow{${vec[1]}${vec[0]}}`;
  };
  vectors = shuffle(vectors).map((vec) => (Math.random() < 0.4 ? '-' + invVec(vec) : `+\\overrightarrow{${vec}}`));
  let statement = vectors.join('');
  if (statement[0] === '+') statement = statement.slice(1, statement.length);

  const question: Question<QCMProps, VEAProps> = {
    answer: answer,
    instruction: `Simplifier : $${statement}$`,
    keys: ['overrightarrow', ...(randLetters.sort((a, b) => a.localeCompare(b)) as KeyId[])],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, randLetters },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, randLetters }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const a = random(randLetters);
    const b = random(randLetters);
    const wrongAnswer = `\\overrightarrow{${a}${b}}`;
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

export const chasles: MathExercise<QCMProps, VEAProps> = {
  id: 'chasles',
  connector: '=',
  label: 'Relation de Chasles pour les vecteurs',
  levels: ['2nde', '1reESM', '1reSpé'],
  isSingleStep: true,
  sections: ['Vecteurs'],
  generator: (nb: number) => getDistinctQuestions(getChaslesQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
