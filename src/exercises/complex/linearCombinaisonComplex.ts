import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Complex, ComplexConstructor } from '#root/math/complex/complex';
import { randint } from '#root/math/utils/random/randint';
import { ComplexNode } from '#root/tree/nodes/complex/complexNode';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';
import { simplifyComplex, simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';
import math, { simplify } from 'mathjs';
import { v4 } from 'uuid';

export const linearCombinaisonComplex: Exercise = {
  id: 'linearCombinaisonComplex',
  connector: '=',
  instruction: '',
  label: 'Combinaison linéaire de deux nombres complexes',
  levels: ['MathExp'],
  isSingleStep: true,
  sections: ['Nombres complexes'],
  generator: (nb: number) => getDistinctQuestions(getLinearCombinaisonComplexQuestion, nb),
};

export function getLinearCombinaisonComplexQuestion(): Question {
  const z1 = ComplexConstructor.random();
  const z2 = ComplexConstructor.random();
  const a = randint(-10, 11, [0]);
  const b = randint(-10, 11, [0]);

  const statement = simplifyNode(
    new AddNode(
      new MultiplyNode(new NumberNode(a), new VariableNode('z_1')),
      new MultiplyNode(new NumberNode(b), new VariableNode('z_2')),
    ),
  );
  //   const statement = simplify(`${a}z+${b}z'`);
  const answer = simplifyComplex(
    new AddNode(new MultiplyNode(new NumberNode(a), z1.toTree()), new MultiplyNode(new NumberNode(b), z2.toTree())),
  ) as ComplexNode;
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer.toTex(),
      isRightAnswer: true,
      format: 'tex',
    });

    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = ComplexConstructor.random();
        proposition = {
          id: v4() + '',
          statement: wrongAnswer.toTree().toTex(),
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
    answer: answer.toTex(),
    instruction: `Soit $z_1=${z1.toTree().toTex()}$ et $z_2=${z2.toTree().toTex()}$. Calculer $${statement.toTex()}$.`,
    keys: ['i', 'z', 'quote'],
    getPropositions,
    answerFormat: 'tex',
    qcmTimer: 60,
    freeTimer: 60,
  };

  return question;
}
