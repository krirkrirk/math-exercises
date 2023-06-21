import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const leadingCoefficientCalculV2: Exercise = {
  id: 'leadingCoefficientCalculV2',
  connector: '=',
  instruction: '',
  label: "Coefficient directeur à l'aide de deux points",
  levels: ['3', '2', '1'],
  isSingleStep: false,
  section: 'Droites',
  generator: (nb: number) => getDistinctQuestions(getLeadingCoefficientCalculV1Question, nb),
};

export function getLeadingCoefficientCalculV1Question(): Question {
  const [xA, yA] = [1, 2].map((el) => randint(-9, 10));
  const xB = randint(-9, 10, [xA]);
  const yB = randint(-9, 10);

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: simplifyNode(new FractionNode(new NumberNode(yB - yA), new NumberNode(xB - xA))).toTex(),
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = simplifyNode(
          new FractionNode(
            new NumberNode(yB - yA + randint(-3, 4, [0])),
            new NumberNode(xB - xA + randint(-3, 4, [0])),
          ),
        ).toTex();

        proposition = {
          id: v4() + '',
          statement: wrongAnswer,
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction: `Soit $d$ une droite passant par les points $A(${xA};${yA})$ et $B(${xB};${yB})$.$\\\\$Déterminer le coefficient directeur de $d$.`,
    answer: simplifyNode(new FractionNode(new NumberNode(yB - yA), new NumberNode(xB - xA))).toTex(),
    getPropositions,
  };
  return question;
}
