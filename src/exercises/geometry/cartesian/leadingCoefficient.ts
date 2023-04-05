import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Droite } from '#root/math/geometry/point';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';

export const leadingCoefficient: Exercise = {
  id: 'leadingCoefficient',
  connector: '=',
  instruction: '',
  label: 'Déterminer le coefficient directeur',
  levels: ['3', '2', '1'],
  isSingleStep: false,
  section: 'Géométrie cartésienne',
  generator: (nb: number) => getDistinctQuestions(getLeadingCoefficientQuestion, nb),
};

export function getLeadingCoefficientQuestion(): Question {
  const numerator = randint(-5, 6, [0]);
  const denominator = randint(-5, 6, [0]);
  const y_intercept = new NumberNode(randint(-2, 7));

  const slope = new NumberNode(numerator / denominator);
  const droite = new Droite('D', slope, y_intercept);

  let instruction = `Quel est le coefficient directeur de la droite ${droite.toEquationExpression}`;

  const question: Question = {
    instruction,
    //startStatement: 'a',
    answer: droite.getLeadingCoefficient(),
  };

  return question;
}
