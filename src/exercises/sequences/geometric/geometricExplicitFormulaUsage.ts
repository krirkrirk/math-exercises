import { MathExercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const geometricExplicitFormulaUsage: MathExercise = {
  id: 'geometricExplicitFormulaUsage',
  connector: '=',
  instruction: '',
  label: "Utiliser la formule générale d'une suite géométrique",
  levels: ['1reESM', '1reSpé', '1reTech', '1rePro', 'TermTech', 'TermPro'],
  sections: ['Suites'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getGeometricExplicitFormulaUsage, nb),
  keys: ['n', 'u', 'underscore'],
  qcmTimer: 60,
  freeTimer: 60,
};

export function getGeometricExplicitFormulaUsage(): Question {
  const askedRank = randint(0, 10);

  const firstValue = randint(1, 10);
  const reason = randint(2, 10);
  const formula = new MultiplyNode(
    new NumberNode(firstValue),
    new PowerNode(new NumberNode(reason), new VariableNode('n')),
  );
  const formulaTex = simplifyNode(formula).toTex();

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: (firstValue * Math.pow(reason, askedRank)).toString(),
      isRightAnswer: true,
      format: 'tex',
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        proposition = {
          id: v4() + '',
          statement: (firstValue * Math.pow(reason, randint(0, 9, [askedRank]))).toString(),
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
    instruction: `$(u_n)$ est une suite géométrique définie par $u_n = ${formulaTex}$. Calculer : $u_{${askedRank}}$`,
    startStatement: `u_{${askedRank}}`,
    answer: (firstValue * Math.pow(reason, askedRank)).toString(),
    keys: ['n', 'u', 'underscore'],
    getPropositions,
    answerFormat: 'tex',
  };
  return question;
}
