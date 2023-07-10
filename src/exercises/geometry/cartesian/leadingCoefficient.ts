import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { DroiteConstructor } from '#root/math/geometry/droite';
import { Point } from '#root/math/geometry/point';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';
import { evaluate } from 'mathjs';
import { v4 } from 'uuid';

export const leadingCoefficient: Exercise = {
  id: 'leadingCoefficient',
  connector: '=',
  instruction: 'Déterminer le coefficient directeur de la droite représentée ci-dessous :',
  label: 'Déterminer le coefficient directeur',
  levels: ['3', '2', '1'],
  isSingleStep: false,
  section: 'Droites',
  generator: (nb: number) => getDistinctQuestions(getLeadingCoefficientQuestion, nb),
};

export function getLeadingCoefficientQuestion(): Question {
  let xA, yA, xB, yB: number;
  let pointA, pointB: Point;

  do {
    [xA, yA] = [1, 2].map((el) => randint(-5, 6));
    xB = xA > 0 ? randint(xA - 4, 6) : randint(-4, xA + 5); // l'écart entre les deux points ne soit pas grand
    yB = yA > 0 ? randint(yA - 4, 6) : randint(-4, yA + 5);
    pointA = new Point('A', new NumberNode(xA), new NumberNode(yA));
    pointB = new Point('B', new NumberNode(xB), new NumberNode(yB));
  } while (xB - xA === 0);

  const droite = DroiteConstructor.fromTwoPoints(pointA, pointB, 'D');
  const a = droite.a.toMathString();
  const b = droite.b.toMathString();
  const aValue = evaluate(a);
  const bValue = evaluate(b);

  let xmin, xmax, ymin, ymax: number;

  if (bValue > 0) {
    ymax = bValue + 1;
    ymin = -1;
  } else {
    ymin = bValue - 1;
    ymax = 1;
  }

  if (-bValue / aValue > 0) {
    xmax = -bValue / aValue + 1;
    xmin = -1;
  } else {
    xmin = -bValue / aValue - 1;
    xmax = 1;
  }

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: droite.getLeadingCoefficient(),
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer =
          droite.getLeadingCoefficient() !== '0'
            ? simplifyNode(new FractionNode(droite.a, new NumberNode(randint(-4, 5, [0, 1]))))
            : new NumberNode(randint(-4, 5, [0]));
        proposition = {
          id: v4() + '',
          statement: wrongAnswer.toTex(),
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    answer: droite.getLeadingCoefficient(),
    keys: [],
    commands: [`f(x) = (${a}) * x + (${b})`],
    coords: [xmin, xmax, ymin, ymax],
    getPropositions,
  };

  return question;
}
