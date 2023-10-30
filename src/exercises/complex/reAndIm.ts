import { MathExercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Complex, ComplexConstructor } from '#root/math/complex/complex';
import { randint } from '#root/math/utils/random/randint';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { simplifyComplex } from '#root/tree/parsers/simplify';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const reAndIm: MathExercise = {
  id: 'getReAndImQuestion',
  connector: '=',
  instruction: '',
  label: 'Identifier partie réelle et partie imaginaire',
  levels: ['MathExp'],
  isSingleStep: true,
  sections: ['Nombres complexes'],
  generator: (nb: number) => getDistinctQuestions(getReAndImQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getReAndImQuestion(): Question {
  const z1 = ComplexConstructor.random();
  const isRe = coinFlip();
  const answer = isRe ? z1.re : z1.im;
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: answer.toString(),
      isRightAnswer: true,
      format: 'tex',
    });
    res.push({
      id: v4() + '',
      statement: z1.im + 'i',
      isRightAnswer: false,
      format: 'tex',
    });

    if (!res.some((prop) => prop.statement === (isRe ? z1.im.toString() : z1.re.toString())))
      res.push({
        id: v4() + '',
        statement: isRe ? z1.im.toString() : z1.re.toString(),
        isRightAnswer: false,
        format: 'tex',
      });
    if (!res.some((prop) => prop.statement === (-z1.im).toString()))
      res.push({
        id: v4() + '',
        statement: (-z1.im).toString(),
        isRightAnswer: false,
        format: 'tex',
      });

    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = randint(-10, 11) + '';
        proposition = {
          id: v4() + '',
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
    answer: answer.toString(),
    instruction: `Soit $z=${z1.toTree().toTex()}$. Quelle est la partie ${isRe ? 'réelle' : 'imaginaire'} de $z$ ?`,
    keys: ['i', 'z'],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
