import { MathExercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { TrinomConstructor } from '#root/math/polynomials/trinom';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const extremumTypeFromAlgebricForm: MathExercise<QCMProps, VEAProps> = {
  id: 'extremumTypeFromAlgebricForm',
  instruction: '',
  label: "Déterminer le type d'extremum d'une fonction du second degré via sa forme algébrique",
  levels: ['1reSpé'],
  isSingleStep: true,
  sections: ['Second degré'],
  generator: (nb: number) => getDistinctQuestions(getExtremumTypeFromAlgebricFormQuestion, nb),
  answerType: 'QCM',
  qcmTimer: 60,
  freeTimer: 60,
};

export function getExtremumTypeFromAlgebricFormQuestion(): Question {
  const isDevForm = coinFlip();
  const trinom = isDevForm ? TrinomConstructor.random() : TrinomConstructor.randomCanonical();
  const answer = trinom.a > 0 ? 'Un minimum' : 'Un maximum';
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer,
      isRightAnswer: true,
      format: 'raw',
    });
    res.push({
      id: v4(),
      statement: trinom.a < 0 ? 'Un minimum' : 'Un maximum',
      isRightAnswer: false,
      format: 'raw',
    });
    res.push({
      id: v4(),
      statement: "Ni l'un ni l'autre",
      isRightAnswer: false,
      format: 'raw',
    });
    res.push({
      id: v4(),
      statement: 'On ne peut pas savoir',
      isRightAnswer: false,
      format: 'raw',
    });
    return shuffle(res);
  };

  const question: Question = {
    answer: answer,
    instruction: `La fonction $f$ définie par $f(x) = ${
      isDevForm ? trinom.toTree().toTex() : trinom.getCanonicalForm().toTex()
    }$ admet-elle un maximum ou un minimum ?`,
    getPropositions,
    answerFormat: 'raw',
    keys: [],
  };

  return question;
}
