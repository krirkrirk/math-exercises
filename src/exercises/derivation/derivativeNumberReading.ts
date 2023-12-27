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
import { Polynomial } from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { simplifyNode } from "#root/tree/parsers/simplify";
import { shuffle } from "#root/utils/shuffle";
import { evaluate } from "mathjs";
import { v4 } from "uuid";

type Identifiers = {
  answer: string;
  A: number[];
  B: number[];
};
type VEAProps = {
  A: number[];
  B: number[];
};

const getDerivativeNumberReading: QuestionGenerator<Identifiers> = () => {
  let xA, yA, xB, yB: number;
  let pointA, pointB: Point;

  do {
    [xA, yA] = [1, 2].map((el) => randint(-5, 6));
    xB = xA > 0 ? randint(xA - 4, 6) : randint(-4, xA + 5); // l'écart entre les deux points ne soit pas grand
    yB = yA > 0 ? randint(yA - 4, 6) : randint(-4, yA + 5);
    pointA = new Point("A", new NumberNode(xA), new NumberNode(yA));
    pointB = new Point("B", new NumberNode(xB), new NumberNode(yB));
  } while (xB - xA === 0);

  const droite = DroiteConstructor.fromTwoPoints(pointA, pointB, "D");

  const [a, b] = [
    (3 * randint(-100, 100, [0])) / 100,
    (2 * randint(-4, 5)) / 100,
  ];
  const c = evaluate(droite.a.toMathString()) - a * Math.pow(xA, 2) - b * xA;
  const d = yA - (a / 3) * Math.pow(xA, 3) - (b / 2) * Math.pow(xA, 2) - xA * c;

  const polynome = new Polynomial([d, c, b / 2, a / 3]);

  const instruction = `Ci-dessous sont tracées la courbe de la fonction $f$ et la tangente à cette courbe au point d'abscisse $${xA}$.$\\\\$ Déterminer $f'(${xA})$.`;
  const commands = [
    polynome.toString(),
    `g(x) = (${droite.a.toMathString()}) * x + (${droite.b.toMathString()})`,
    `(${xA},${yA})`,
  ];

  const answer = droite.getLeadingCoefficient();
  const question: Question<Identifiers> = {
    instruction,
    startStatement: "a",
    answer,
    commands,
    coords: [xA - 5, xA + 5, yA - 5, yA + 5],
    answerFormat: "tex",
    keys: [],
    identifiers: { answer, A: [xA, yA], B: [xB, yB] },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, A, B }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const pointA = new Point("A", new NumberNode(A[0]), new NumberNode(A[1]));
  const pointB = new Point("B", new NumberNode(B[0]), new NumberNode(B[1]));
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

const isAnswerValid: VEA<Identifiers> = (ans, { A, B }) => {
  const answer = new Rational(B[1] - A[1], B[0] - A[0])
    .simplify()
    .toTree({ allowFractionToDecimal: true });
  const texs = answer.toAllValidTexs();
  console.log(texs);
  return texs.includes(ans);
};

export const derivativeNumberReading: MathExercise<Identifiers> = {
  id: "derivativeNumberReading",
  connector: "=",
  label: "Lecture de nombre dérivé",
  levels: ["1reESM", "1reSpé", "1reTech", "MathComp", "1rePro"],
  sections: ["Dérivation"],
  isSingleStep: false,
  generator: (nb: number) =>
    getDistinctQuestions(getDerivativeNumberReading, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
