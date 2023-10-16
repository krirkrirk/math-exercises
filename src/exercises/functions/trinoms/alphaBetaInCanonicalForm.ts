import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { TrinomConstructor } from '#root/math/polynomials/trinom';
import { randint } from '#root/math/utils/random/randint';
import { OppositeNode } from '#root/tree/nodes/functions/oppositeNode';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const alphaBetaInCanonicalForm: Exercise = {
  id: 'alphaInCanonicalForm',
  connector: '=',
  instruction: '',
  label: 'Identifier $\\alpha$ et $\\beta$ dans la forme canonique',
  levels: ['1reSpé'],
  isSingleStep: true,
  sections: ['Second degré'],
  generator: (nb: number) => getDistinctQuestions(getAlphaBetaInCanonicalFormQuestion, nb),
};

export function getAlphaBetaInCanonicalFormQuestion(): Question {
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
    if (beta !== alpha)
      res.push({
        id: v4() + '',
        statement: param === '\\alpha' ? betaTex : alphaTex,
        isRightAnswer: false,
        format: 'tex',
      });
    if (alpha !== 0 && (param === '\\alpha' || beta !== -alpha))
      res.push({
        id: v4() + '',
        statement: simplifyNode(new OppositeNode(new NumberNode(alpha))).toTex(),
        isRightAnswer: false,
        format: 'tex',
      });
    if (!res.some((prop) => prop.statement === trinom.a.toString())) {
      res.push({
        id: v4() + '',
        statement: trinom.a.toString(),
        isRightAnswer: false,
        format: 'tex',
      });
    }

    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = randint(-10, 11);
        proposition = {
          id: v4() + '',
          statement: wrongAnswer.toString(),
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
    instruction: `Soit $f$ la fonction définie par $f(x) = ${trinom
      .getCanonicalForm()
      .toTex()}$. Que vaut $${param}$ ?`,
    answer: answer,
    keys: ['x', 'alpha', 'beta'],
    getPropositions,
    answerFormat: 'tex',
    startStatement: param,
    qcmTimer: 60,
    freeTimer: 60,
  };

  return question;
}
