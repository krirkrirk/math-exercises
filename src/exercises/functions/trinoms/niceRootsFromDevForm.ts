import { MathExercise, Proposition, Question, tryToAddWrongProp } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { TrinomConstructor } from '#root/math/polynomials/trinom';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const niceRootsFromDevForm: MathExercise = {
  id: 'niceRootsFromDevForm',
  connector: '\\iff',
  instruction: '',
  label: 'Résoudre une équation du second degré (solutions entières)',
  levels: ['1reSpé', 'TermSpé', 'MathComp'],
  isSingleStep: true,
  sections: ['Second degré'],
  generator: (nb: number) => getDistinctQuestions(getRootsFromDevFormQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getRootsFromDevFormQuestion(): Question {
  const trinom = TrinomConstructor.randomFactorized();
  const answer = trinom.getRootsEquationSolutionTex();
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });
    tryToAddWrongProp(res, 'S=\\emptyset');

    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;
      do {
        let wrongX1 = randint(-19, 0);
        let wrongX2 = randint(0, 20);
        const wrongAnswer = `S=\\left\\{${wrongX1};${wrongX2}\\right\\}`;
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
    keys: ['S', 'equal', 'lbrace', 'semicolon', 'rbrace', 'emptyset'],

    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
