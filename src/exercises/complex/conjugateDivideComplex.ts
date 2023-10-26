import { MathExercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Complex, ComplexConstructor } from '#root/math/complex/complex';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const conjugateDivideComplex: MathExercise = {
  id: 'conjugateDivideComplex',
  connector: '=',
  instruction: '',
  label: "Conjugué d'une fraction de nombres complexes",
  levels: ['MathExp'],
  isSingleStep: true,
  sections: ['Nombres complexes'],
  generator: (nb: number) => getDistinctQuestions(getConjugateDivideComplexQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getConjugateDivideComplexQuestion(): Question {
  const z1 = ComplexConstructor.random();
  let z2: Complex;
  do {
    z2 = ComplexConstructor.random();
  } while (z1.im === 0 && z2.im === 0);

  const conjz1 = z1.conjugate();
  const conjz2 = z2.conjugate();

  const answerTex = conjz1.divideNode(conjz2).toTex();
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answerTex,
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
    answer: answerTex,
    instruction: `Soit $z=${z1.toTree().toTex()}$ et $z'=${z2
      .toTree()
      .toTex()}$. Calculer le conjugué de $\\frac{z}{z'}$.`,
    keys: ['i', 'z', 'overline', 'quote'],
    getPropositions,
    answerFormat: 'tex',

    startStatement: "\\overline{\\frac{z}{z'}}",
  };

  return question;
}
