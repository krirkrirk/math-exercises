import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Complex, ComplexConstructor } from '#root/math/complex/complex';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const inverseComplex: Exercise = {
  id: 'inverseComplex',
  connector: '=',
  instruction: '',
  label: "Inverse d'un nombre complexe",
  levels: ['MathExp'],
  isSingleStep: true,
  sections: ['Nombres complexes'],
  generator: (nb: number) => getDistinctQuestions(getInverseComplexQuestion, nb),
};

export function getInverseComplexQuestion(): Question {
  const complex = ComplexConstructor.randomNotReal();
  const answer = complex.inverseNode().toTex();
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
    const conj = complex.conjugate().toTree().toTex();
    if (!res.some((prop) => prop.statement === conj))
      res.push({
        id: v4(),
        statement: conj,
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
    instruction: `Déterminer l'inverse de $z=${complex.toTree().toTex()}$.`,
    keys: ['i'],
    getPropositions,
    answerFormat: 'tex',
    startStatement: '\\frac{1}{z}',
  };

  return question;
}
