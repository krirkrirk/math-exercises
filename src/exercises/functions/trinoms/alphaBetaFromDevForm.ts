import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Integer } from '#root/math/numbers/integer/integer';
import { TrinomConstructor } from '#root/math/polynomials/trinom';
import { DiscreteSet } from '#root/math/sets/discreteSet';
import { randint } from '#root/math/utils/random/randint';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const alphaBetaFromDevForm: Exercise = {
  id: 'alphaBetaFromDevForm',
  connector: '=',
  instruction: '',
  label: 'Déterminer $\\alpha$ ou $\\beta$ à partir de la forme développée',
  levels: ['1reSpé'],
  isSingleStep: false,
  sections: ['Second degré'],
  generator: (nb: number) => getDistinctQuestions(getAlphaBetaFromDevFormQuestion, nb),
};

export function getAlphaBetaFromDevFormQuestion(): Question {
  const trinom = TrinomConstructor.randomCanonical();
  const param = coinFlip() ? '\\alpha' : '\\beta';
  const alpha = trinom.getAlpha();
  const beta = trinom.getBeta();
  const alphaTex = trinom.getAlphaNode().toTex();
  const betaTex = trinom.getBetaNode().toTex();
  const answer = param === '\\alpha' ? alphaTex : betaTex;

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });

    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        proposition = {
          id: v4() + '',
          statement: randint(-10, 11).toString(),
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
    keys: ['x', 'alpha', 'beta'],
    instruction: `Soit $f$ la fonction définie par $f(x) = ${trinom.toTree().toTex()}$. Que vaut $${param}$ ?`,
    getPropositions,
    answerFormat: 'tex',
    startStatement: param,
  };

  return question;
}
