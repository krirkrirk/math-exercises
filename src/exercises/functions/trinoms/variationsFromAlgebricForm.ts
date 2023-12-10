import { MathExercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { TrinomConstructor } from '#root/math/polynomials/trinom';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const variationsFromAlgebricForm: MathExercise<QCMProps, VEAProps> = {
  id: 'variationsFromAlgebricForm',
  instruction: '',
  label: "Déterminer les variations d'une fonction du second degré via sa forme algébrique",
  levels: ['1reSpé'],
  isSingleStep: true,
  sections: ['Second degré'],
  generator: (nb: number) => getDistinctQuestions(getVariationsFromAlgebricFormQuestion, nb),
  answerType: 'QCM',
  qcmTimer: 60,
  freeTimer: 60,
};

export function getVariationsFromAlgebricFormQuestion(): Question {
  const isDevForm = coinFlip();
  const trinom = isDevForm ? TrinomConstructor.random() : TrinomConstructor.randomCanonical();
  const answer = trinom.a > 0 ? 'Décroissante puis croissante' : 'Croissante puis décroissante';
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
      statement: trinom.a < 0 ? 'Décroissante puis croissante' : 'Croissante puis décroissante',
      isRightAnswer: false,
      format: 'raw',
    });
    res.push({
      id: v4(),
      statement: 'Constante',
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
    instruction: `Quelles sont les variations de la fonction $f$ définie par $f(x) = ${
      isDevForm ? trinom.toTree().toTex() : trinom.getCanonicalForm().toTex()
    }$ ?`,
    getPropositions,
    answerFormat: 'raw',
  };

  return question;
}
