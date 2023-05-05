import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { simplifyNode } from '#root/tree/parsers/simplify';

export const leadingCoefficientCalculV2: Exercise = {
  id: 'leadingCoefficientCalculV2',
  connector: '=',
  instruction: '',
  label: "Calculer le coefficient directeur d'une droite qui passe par deux points",
  levels: ['3', '2', '1'],
  isSingleStep: true,
  section: 'Géométrie cartésienne',
  generator: (nb: number) => getDistinctQuestions(getLeadingCoefficientCalculV1Question, nb),
};

export function getLeadingCoefficientCalculV1Question(): Question {
  const [xA, yA] = [1, 2].map((el) => randint(-9, 10));
  const xB = randint(-9, 10, [xA]);
  const yB = randint(-9, 10);

  const question: Question = {
    instruction: `Soit d'une droite passant par les points A(${xA},${yA}) et B(${xB},${yB}).$\\\\$Déterminer le coefficient directeur de cette droite.`,
    answer: simplifyNode(new FractionNode(new NumberNode(yB - yA), new NumberNode(xB - xA))).toTex(),
  };
  return question;
}
