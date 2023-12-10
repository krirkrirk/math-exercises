import { MathExercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Complex, ComplexConstructor } from '#root/math/complex/complex';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const mutiplyComplex: MathExercise<QCMProps, VEAProps> = {
  id: 'mutiplyComplex',
  connector: '=',
  instruction: '',
  label: 'Multiplier deux nombres complexes',
  levels: ['MathExp'],
  isSingleStep: true,
  sections: ['Nombres complexes'],
  generator: (nb: number) => getDistinctQuestions(getMutiplyComplexQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getMutiplyComplexQuestion(): Question {
  const z1 = ComplexConstructor.random();
  let z2: Complex;
  do {
    z2 = ComplexConstructor.random();
  } while (z1.im === 0 && z2.im === 0);

  const answer = z1.multiply(z2).toTree();
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
    instruction: `Soit $z=${z1.toTree().toTex()}$ et $z'=${z2.toTree().toTex()}$. Calculer $z\\times z'$.`,
    keys: ['i', 'z', 'quote'],
    getPropositions,
    answerFormat: 'tex',

    startStatement: "z\\times z'",
  };

  return question;
}
