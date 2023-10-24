import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { IntervalConstructor } from '#root/math/sets/intervals/intervals';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const intervalsIntersection: Exercise = {
  id: 'intervalsIntersection',
  connector: '=',
  instruction: '',
  label: "Déterminer l'intersection de deux intervalles",
  levels: ['2nde', '1reESM'],
  isSingleStep: true,
  sections: ['Ensembles et intervalles'],
  generator: (nb: number) => getDistinctQuestions(getIntervalsIntersectionQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getIntervalsIntersectionQuestion(): Question {
  const [int1, int2] = IntervalConstructor.differentRandoms(2);
  const inter = int1.intersection(int2);

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: inter.toTex(),
      isRightAnswer: true,
      format: 'tex',
    });

    const unionTex = int1.union(int2).tex;
    if (unionTex !== inter.tex) {
      res.push({
        id: v4(),
        statement: unionTex,
        isRightAnswer: false,
        format: 'tex',
      });
    }

    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = IntervalConstructor.random().tex;
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
    answer: inter.tex,
    instruction: `Soit $I = ${int1.toTex()}$ et $J = ${int2.toTex()}$. Déterminer $I\\cap J$.`,
    keys: ['infty', 'emptyset', 'lbracket', 'rbracket', 'semicolon', 'cup', 'cap'],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
