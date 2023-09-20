import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Complex, ComplexConstructor } from '#root/math/complex/complex';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { SubstractNode } from '#root/tree/nodes/operators/substractNode';
import { simplifyComplex } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const addComplex: Exercise = {
  id: 'addComplex',
  connector: '=',
  instruction: '',
  label: 'Ajouter deux nombres complexes',
  levels: ['MathExp'],
  isSingleStep: true,
  sections: ['Nombres complexes'],
  generator: (nb: number) => getDistinctQuestions(getAddComplexQuestion, nb),
};

export function getAddComplexQuestion(): Question {
  const z1 = ComplexConstructor.random();
  const z2 = ComplexConstructor.random();

  const answer = simplifyComplex(new AddNode(z1.toTree(), z2.toTree()));
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: answer.toTex(),
      isRightAnswer: true,
      format: 'tex',
    });
    res.push({
      id: v4(),
      statement: simplifyComplex(new SubstractNode(z1.toTree(), z2.toTree())).toTex(),
      isRightAnswer: false,
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
    instruction: `Soit $z=${z1.toTree().toTex()}$ et $z'=${z2.toTree().toTex()}$. Calculer $z + z'$.`,
    keys: ['i', 'z', 'quote'],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
