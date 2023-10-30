import { MathExercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { IntervalConstructor } from '#root/math/sets/intervals/intervals';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const intervalsUnion: MathExercise = {
  id: 'intervalsUnion',
  connector: '=',
  instruction: '',
  label: "Déterminer l'union de deux intervalles",
  levels: ['2nde', '2ndPro', '1reTech', 'CAP'],
  isSingleStep: true,
  sections: ['Ensembles et intervalles'],
  generator: (nb: number) => getDistinctQuestions(getIntervalsUnionQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getIntervalsUnionQuestion(): Question {
  const [int1, int2] = IntervalConstructor.differentRandoms(2);
  const set = int1.union(int2);
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: set.tex,
      isRightAnswer: true,
      format: 'tex',
    });
    const interTex = int1.intersection(int2).tex;
    if (interTex !== set.tex)
      res.push({
        id: v4(),
        statement: int1.intersection(int2).tex,
        isRightAnswer: false,
        format: 'tex',
      });

    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = IntervalConstructor.random().tex;
        proposition = {
          id: v4(),
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
    answer: set.tex,
    instruction: `Soit $I = ${int1.tex}$ et $J = ${int2.tex}$. Déterminer $I\\cup J$.`,
    keys: ['infty', 'lbracket', 'rbracket', 'semicolon', 'cup', 'cap'],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
