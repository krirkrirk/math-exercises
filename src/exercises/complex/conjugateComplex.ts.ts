import { MathExercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Complex, ComplexConstructor } from '#root/math/complex/complex';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const conjugateComplex: MathExercise<QCMProps, VEAProps> = {
  id: 'conjugateComplex',
  connector: '=',
  instruction: '',
  label: "Conjugué d'un nombre complexe",
  levels: ['MathExp'],
  isSingleStep: true,
  sections: ['Nombres complexes'],
  generator: (nb: number) => getDistinctQuestions(getConjugateComplexQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getConjugateComplexQuestion(): Question {
  const complex = ComplexConstructor.random();
  const answer = complex.conjugate().toTree().toTex();
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });
    const opposite = complex.opposite().toTree().toTex();
    if (opposite !== answer)
      res.push({
        id: v4(),
        statement: opposite,
        isRightAnswer: false,
        format: 'tex',
      });
    const conjOpposite = complex.conjugate().opposite().toTree().toTex();
    if (!res.some((prop) => prop.statement === conjOpposite))
      res.push({
        id: v4(),
        statement: conjOpposite,
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
          id: v4() + ``,
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
    answer,
    instruction: `Déterminer le conjugué de $z=${complex.toTree().toTex()}$.`,
    keys: ['i', 'overline'],
    getPropositions,
    answerFormat: 'tex',

    startStatement: '\\overline z',
  };

  return question;
}
