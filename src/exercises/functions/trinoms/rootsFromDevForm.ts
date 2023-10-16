import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { TrinomConstructor } from '#root/math/polynomials/trinom';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const rootsFromDevForm: Exercise = {
  id: 'rootsFromDevForm',
  connector: '\\iff',
  instruction: '',
  label: 'Résoudre une équation du second degré',
  levels: ['1reSpé', 'TermSpé', 'MathComp'],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) => getDistinctQuestions(getRootsFromDevFormQuestion, nb),
};

export function getRootsFromDevFormQuestion(): Question {
  const trinom = TrinomConstructor.random();
  const answer = trinom.getRootsEquationSolutionTex();
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
        const wrongAnswer = '';
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
    instruction: `Soit $f(x) = ${trinom.toTree().toTex()}$. Résoudre l'équation $f(x) = 0$.`,
    keys: [],
    getPropositions,
    answerFormat: 'tex',
    qcmTimer: 60,
    freeTimer: 60,
  };

  return question;
}
