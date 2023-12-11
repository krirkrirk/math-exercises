import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  addValidProp,
  tryToAddWrongProp,
} from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { DroiteConstructor } from '#root/math/geometry/droite';
import { Point } from '#root/math/geometry/point';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';
import { evaluate } from 'mathjs';
type QCMProps = {
  answer: string;
  xA: number;
  yA: number;
  xB: number;
  yB: number;
};
type VEAProps = {};

const getLeadingCoefficientQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
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

  const answer = droite.getLeadingCoefficient();
  const question: Question<QCMProps, VEAProps> = {
    instruction: 'Déterminer le coefficient directeur de la droite représentée ci-dessous : ',
    answer,
    keys: [],
    commands: [`f(x) = (${a}) * x + (${b})`],
    coords: [xmin, xmax, ymin, ymax],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, xA, xB, yA, yB },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, xA, xB, yA, yB }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const pointA = new Point('A', new NumberNode(xA), new NumberNode(yA));
  const pointB = new Point('B', new NumberNode(xB), new NumberNode(yB));
  const droite = DroiteConstructor.fromTwoPoints(pointA, pointB, 'D');
  const leadingCoefficient = droite.getLeadingCoefficient();
  while (propositions.length < n) {
    const wrongAnswer =
      leadingCoefficient !== '0'
        ? simplifyNode(new FractionNode(droite.a, new NumberNode(randint(-4, 5, [0, 1]))))
        : new NumberNode(randint(-4, 5, [0]));
    tryToAddWrongProp(propositions, wrongAnswer.toTex());
  }

  return shuffle(propositions);
};

export const leadingCoefficient: MathExercise<QCMProps, VEAProps> = {
  id: 'leadingCoefficient',
  connector: '=',
  label: 'Lire le coefficient directeur',
  levels: ['3ème', '2nde', '1reESM', '2ndPro', '1rePro', '1reTech'],
  isSingleStep: false,
  sections: ['Droites'],
  generator: (nb: number) => getDistinctQuestions(getLeadingCoefficientQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
