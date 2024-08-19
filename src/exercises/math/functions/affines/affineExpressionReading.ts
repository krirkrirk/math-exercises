import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randomColor } from "#root/geogebra/colors";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { Rational } from "#root/math/numbers/rationals/rational";
import { Affine, AffineConstructor } from "#root/math/polynomials/affine";
import { randint } from "#root/math/utils/random/randint";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { Node } from "#root/tree/nodes/node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";

type Identifiers = {
  b: number;
  secondPoint: number[];
};

const getAffineExpressionReadingQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const b = randint(-5, 6);
  const secondPoint = [randint(-5, 6, [0]), randint(-5, 6)];
  const leadingCoeff = new Rational(secondPoint[1] - b, secondPoint[0])
    .simplify()
    .toTree();
  const answer = new EqualNode(
    new VariableNode("f(x)"),
    new AddNode(
      new MultiplyNode(leadingCoeff, new VariableNode("x")),
      new NumberNode(b),
    ).simplify({ forceDistributeFractions: true, forbidFactorize: true }),
  ).toTex();

  let xMin = Math.min(0, secondPoint[0]);
  let xMax = Math.max(0, secondPoint[0]);
  let yMin = Math.min(b, secondPoint[1]);
  let yMax = Math.max(b, secondPoint[1]);

  const commands = [
    `l = Line[(0, ${b}), (${secondPoint[0]}, ${secondPoint[1]})]`,
    `SetColor(l, "${randomColor()}")`,
    "SetFixed(l, true)",
  ];
  const ggb = new GeogebraConstructor(commands, {
    gridDistance: [1, 1],
    isGridSimple: true,
  });
  const question: Question<Identifiers> = {
    answer,
    instruction: `Ci-dessous est tracée la courbe représentative d'une fonction affine $f$. Déterminer graphiquement l'expression algébrique de $f(x)$.`,
    keys: ["fx", "equal", "x"],
    commands: ggb.commands,
    coords: ggb.getAdaptedCoords({ xMin, xMax, yMin, yMax }),
    options: ggb.getOptions(),
    answerFormat: "tex",
    identifiers: { b, secondPoint },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, b, secondPoint },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const wrongAs: AlgebraicNode[] = [];
  if (secondPoint[1] - b !== 0)
    wrongAs.push(
      new Rational(secondPoint[0], secondPoint[1] - b).simplify().toTree(),
    );
  if (secondPoint[0] !== 0)
    wrongAs.push(
      new Rational(secondPoint[1] + b, secondPoint[0]).simplify().toTree(),
    );
  if (secondPoint[1] + b !== 0)
    wrongAs.push(
      new Rational(secondPoint[0], secondPoint[1] + b).simplify().toTree(),
    );
  if (b !== 0)
    wrongAs.push(
      new Rational(secondPoint[1] - secondPoint[0], b).simplify().toTree(),
    );
  const fx = new VariableNode("f(x)");
  const x = new VariableNode("x");
  wrongAs.forEach((coeff) => {
    tryToAddWrongProp(
      propositions,
      new EqualNode(
        fx,
        new AddNode(new MultiplyNode(coeff, x), new NumberNode(b)).simplify({
          forceDistributeFractions: true,
          forbidFactorize: true,
        }),
      ).toTex(),
    );
  });
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      new EqualNode(fx, AffineConstructor.random().toTree()).toTex(),
    );
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, secondPoint, b }) => {
  const leadingCoeff = new Rational(secondPoint[1] - b, secondPoint[0])
    .simplify()
    .toTree();
  const tree = new EqualNode(
    new VariableNode("f(x)"),
    new AddNode(
      new MultiplyNode(leadingCoeff, new VariableNode("x")),
      new NumberNode(b),
    ).simplify({ forceDistributeFractions: true, forbidFactorize: true }),
    {
      allowFractionToDecimal: true,
      allowMinusAnywhereInFraction: true,
      allowRawRightChildAsSolution: true,
    },
  );
  const texs = tree.toAllValidTexs();
  return texs.includes(ans);
};
export const affineExpressionReading: Exercise<Identifiers> = {
  id: "affineExpressionReading",
  connector: "=",
  label: "Lire graphiquement l'expression d'une fonction affine",
  levels: ["2nde", "1reESM", "1rePro", "1reSpé", "1reTech"],
  isSingleStep: true,
  sections: ["Droites", "Fonctions affines"],
  generator: (nb: number) =>
    getDistinctQuestions(getAffineExpressionReadingQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  hasGeogebra: true,
  subject: "Mathématiques",
};
