import { MathExercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { KeyId } from '#root/types/keyIds';
import { random } from '#root/utils/random';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const chasles: MathExercise<QCMProps, VEAProps> = {
  id: 'chasles',
  connector: '=',
  instruction: '',
  label: 'Relation de Chasles pour les vecteurs',
  levels: ['2nde', '1reESM', '1reSpé'],
  isSingleStep: true,
  sections: ['Vecteurs'],
  generator: (nb: number) => getDistinctQuestions(getChaslesQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

const letters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ';

export function getChaslesQuestion(): Question {
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
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });

    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const a = random(randLetters);
        const b = random(randLetters);
        const wrongAnswer = `\\overrightarrow{${a}${b}}`;
        proposition = {
          id: v4() + ``,
          statement: wrongAnswer,
          isRightAnswer: false,
          format: 'tex',
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    answer: answer,
    instruction: `Simplifier : $${statement}$`,
    keys: ['overrightarrow', ...(randLetters.sort((a, b) => a.localeCompare(b)) as KeyId[])],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
