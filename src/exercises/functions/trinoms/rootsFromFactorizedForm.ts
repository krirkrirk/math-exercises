import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { TrinomConstructor } from '#root/math/polynomials/trinom';
import { randint } from '#root/math/utils/random/randint';
import { OppositeNode } from '#root/tree/nodes/functions/oppositeNode';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const rootsFromFactorizedForm: Exercise = {
  id: 'rootsFromFactorizedForm',
  connector: '=',
  instruction: '',
  label: "Déterminer les racines d'un trinôme à partir de sa forme factorisée",
  levels: ['1reSpé', 'TermSpé', 'MathComp'],
  isSingleStep: true,
  sections: ['Second degré'],
  generator: (nb: number) => getDistinctQuestions(getRootsFromFactorizedFormQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getRootsFromFactorizedFormQuestion(): Question {
  const trinom = TrinomConstructor.randomFactorized();
  const answer = trinom.getRootsEquationSolutionTex();
  const roots = trinom.getRoots();
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });

    if (roots.length === 1 && roots[0] !== 0) {
      res.push({
        id: v4(),
        statement: `S = \\lbrace ${new OppositeNode(new NumberNode(roots[0]))} \\rbrace`,
        isRightAnswer: false,
        format: 'tex',
      });
    }
    if (roots.length === 2 && roots[0] !== 0) {
      res.push({
        id: v4(),
        statement: `S = \\lbrace ${new OppositeNode(new NumberNode(roots[0])).toTex()} ; ${roots[1]} \\rbrace`,
        isRightAnswer: false,
        format: 'tex',
      });
    }
    if (roots.length === 2 && roots[1] !== 0) {
      res.push({
        id: v4(),
        statement: `S = \\lbrace ${roots[0]} ; ${new OppositeNode(new NumberNode(roots[1])).toTex()} \\rbrace`,
        isRightAnswer: false,
        format: 'tex',
      });
    }
    if (roots.length === 2 && roots[0] !== 0 && roots[1] !== 0) {
      res.push({
        id: v4(),
        statement: `S = \\lbrace ${new OppositeNode(new NumberNode(roots[0])).toTex()} ; ${new OppositeNode(
          new NumberNode(roots[1]),
        ).toTex()} \\rbrace`,
        isRightAnswer: false,
        format: 'tex',
      });
    }

    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = `S = \\lbrace ${randint(-10, 11)}; ${randint(-10, 11)} \\rbrace`;
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
    instruction: `Soit $f(x) = ${trinom.getFactorizedForm().toTex()}$. Résoudre l'équation $f(x) = 0$.`,
    keys: ['S', 'equal', 'lbrace', 'semicolon', 'rbrace', 'emptyset'],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
