import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { TrinomConstructor } from '#root/math/polynomials/trinom';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const extremumFromCanonicalForm: Exercise = {
  id: 'extremumFromCanonicalForm',
  connector: '=',
  instruction: '',
  label: "Déterminer les coordonnées du sommet d'une parabole à partir de la forme canonique",
  levels: ['1reSpé'],
  isSingleStep: true,
  sections: ['Second degré'],
  generator: (nb: number) => getDistinctQuestions(getExtremumFromCanonicalFormQuestion, nb),
};

export function getExtremumFromCanonicalFormQuestion(): Question {
  const trinom = TrinomConstructor.randomCanonical();
  const answer = trinom.getSommet();
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];
    res.push({
      id: v4() + '',
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });
    const alpha = trinom.getAlpha();
    const beta = trinom.getBeta();
    if (alpha !== beta) {
      res.push({
        id: v4(),
        statement: `S\\left(${beta}; ${alpha}\\right)`,
        isRightAnswer: false,
        format: 'tex',
      });
    }
    if (alpha !== 0) {
      res.push({
        id: v4(),
        statement: `S\\left(${-alpha}; ${beta}\\right)`,
        isRightAnswer: false,
        format: 'tex',
      });
    }
    if (beta !== 0) {
      res.push({
        id: v4(),
        statement: `S\\left(${alpha}; ${-beta}\\right)`,
        isRightAnswer: false,
        format: 'tex',
      });
    }

    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;
      do {
        proposition = {
          id: v4() + '',
          statement: `S\\left(${randint(-10, 11)}; ${randint(-10, 11)} \\right)`,
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
    instruction: `Soit $f$ la fonction définie par $${trinom
      .getCanonicalForm()
      .toTex()}$. Quelles sont les coordonnées du sommet $S$ de la parabole représentative de $f$ ?`,
    keys: ['S', '=', 'semicolon'],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
