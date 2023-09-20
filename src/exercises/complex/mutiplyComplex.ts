import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Complex, ComplexConstructor } from '#root/math/complex/complex';
import { randint } from '#root/math/utils/random/randint';
import { ComplexNode } from '#root/tree/nodes/complex/complexNode';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { simplifyComplex } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const mutiplyComplex: Exercise = {
  id: 'mutiplyComplex',
  connector: '=',
  instruction: '',
  label: 'Multiplier deux nombres complexes',
  levels: ['MathExp'],
  isSingleStep: true,
  sections: ['Nombres complexes'],
  generator: (nb: number) => getDistinctQuestions(getMutiplyComplexQuestion, nb),
};

export function getMutiplyComplexQuestion(): Question {
  const z1 = ComplexConstructor.random();
  const z2 = ComplexConstructor.random();

  const answer = simplifyComplex(new MultiplyNode(z1.toTree(), z2.toTree())) as ComplexNode;
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer.toTex(),
      isRightAnswer: true,
      format: 'tex',
    });

    res.push({
      id: v4(),
      statement: answer.toComplex().conjugate().toTree().toTex(),
      isRightAnswer: true,
      format: 'tex',
    });

    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = randint(1, 9);
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
    answer: answer.toTex(),
    instruction: `Soit $z=${z1.toTree().toTex()}$ et $z'=${z2.toTree().toTex()}$. Calculer $z\\times z'$.`,
    keys: ['i', 'z', 'quote'],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
