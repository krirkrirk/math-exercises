import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Complex, ComplexConstructor } from '#root/math/complex/complex';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const conjugateMultiplyComplex: Exercise = {
  id: 'conjugateMultiplyComplex',
  connector: '=',
  instruction: '',
  label: "Conjugué d'un produit de nombres complexes",
  levels: ['MathExp'],
  isSingleStep: true,
  sections: ['Nombres complexes'],
  generator: (nb: number) => getDistinctQuestions(getConjugateMultiplyComplexQuestion, nb),
};

export function getConjugateMultiplyComplexQuestion(): Question {
  const z1 = ComplexConstructor.random();
  let z2: Complex;
  do {
    z2 = ComplexConstructor.random();
  } while (z1.im === 0 && z2.im === 0);

  const prod = z1.multiply(z2);
  const conj = prod.conjugate();
  const answer = conj.toTree();
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
      statement: prod.toTree().toTex(),
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
          id: v4(),
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
    instruction: `Soit $z=${z1.toTree().toTex()}$ et $z'=${z2.toTree().toTex()}$. Calculer $\\overline{z\\times z'}$.`,
    keys: ['i', 'z', 'quote'],
    getPropositions,
    answerFormat: 'tex',
    startStatement: "\\overline{z\\times z'}",
  };

  return question;
}
