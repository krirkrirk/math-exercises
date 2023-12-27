import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { DroiteConstructor } from "#root/math/geometry/droite";
import { Point } from "#root/math/geometry/point";
import { Rational } from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { simplifyNode } from "#root/tree/parsers/simplify";
import { shuffle } from "#root/utils/shuffle";
import { evaluate } from "mathjs";
type Identifiers = {
  xA: number;
  yA: number;
  xB: number;
  yB: number;
};

const getLeadingCoefficientQuestion: QuestionGenerator<Identifiers> = () => {
  let xA, yA, xB, yB: number;
  let pointA, pointB: Point;

  [xA, yA] = [1, 2].map((el) => randint(-5, 6));
  xB = xA > 0 ? randint(xA - 4, 6, [xA]) : randint(-4, xA + 5, [xA]); // l'écart entre les deux points ne soit pas grand
  yB = yA > 0 ? randint(yA - 4, 6) : randint(-4, yA + 5);
  pointA = new Point("A", new NumberNode(xA), new NumberNode(yA));
  pointB = new Point("B", new NumberNode(xB), new NumberNode(yB));

  const droite = DroiteConstructor.fromTwoPoints(pointA, pointB, "D");
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
  const question: Question<Identifiers> = {
    instruction:
      "Déterminer le coefficient directeur de la droite représentée ci-dessous : ",
    answer,
    keys: [],
    commands: [`f(x) = (${a}) * x + (${b})`],
    coords: [xmin, xmax, ymin, ymax],
    answerFormat: "tex",
    identifiers: { xA, xB, yA, yB },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, xA, xB, yA, yB },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const pointA = new Point("A", new NumberNode(xA), new NumberNode(yA));
  const pointB = new Point("B", new NumberNode(xB), new NumberNode(yB));
  const droite = DroiteConstructor.fromTwoPoints(pointA, pointB, "D");
  const leadingCoefficient = droite.getLeadingCoefficient();
  while (propositions.length < n) {
    const wrongAnswer =
      leadingCoefficient !== "0"
        ? simplifyNode(
            new FractionNode(droite.a, new NumberNode(randint(-4, 5, [0, 1]))),
          )
        : new NumberNode(randint(-4, 5, [0]));
    tryToAddWrongProp(propositions, wrongAnswer.toTex());
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { xA, xB, yA, yB }) => {
  // const leadingCoeff = new Rational(yB - yA, xB - xA)
  //   .simplify()
  //   .toTree({ allowFractionToDecimal: true });
  // const texs = leadingCoeff.toAllValidTexs();
  // return texs.includes(ans);
  return true;
};

export const leadingCoefficient: MathExercise<Identifiers> = {
  id: "leadingCoefficient",
  connector: "=",
  label: "Lire le coefficient directeur",
  levels: ["3ème", "2nde", "1reESM", "2ndPro", "1rePro", "1reTech"],
  isSingleStep: false,
  sections: ["Droites"],
  generator: (nb: number) =>
    getDistinctQuestions(getLeadingCoefficientQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
