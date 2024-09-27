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
import { Point } from "#root/math/geometry/point";
import {
  SquareRoot,
  SquareRootConstructor,
} from "#root/math/numbers/reals/real";
import { distinctRandTupleInt } from "#root/math/utils/random/randTupleInt";
import { round } from "#root/math/utils/round";
import { SqrtNode } from "#root/tree/nodes/functions/sqrtNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";

type Identifiers = {
  coords1: number[];
  coords2: number[];
};

const getDistanceBetweenTwoPoints: QuestionGenerator<Identifiers> = () => {
  const [coords1, coords2] = distinctRandTupleInt(2, 2, { from: -9, to: 10 });
  let A = new Point(
    "A",
    new NumberNode(coords1[0]),
    new NumberNode(coords1[1]),
  );
  let B = new Point(
    "B",
    new NumberNode(coords2[0]),
    new NumberNode(coords2[1]),
  );

  const answer = new SquareRoot(round(A.distanceTo(B) ** 2, 0))
    .simplify()
    .toTree()
    .toTex();

  const question: Question<Identifiers> = {
    instruction: `Soit $${A.toTexWithCoords()}$ et $${B.toTexWithCoords()}$. Calculer la distance $AB$.`,
    startStatement: "AB",
    answer,
    keys: [],
    answerFormat: "tex",
    identifiers: { coords1, coords2 },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, coords1, coords2 },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const xA = new NumberNode(coords1[0]);
  const xB = new NumberNode(coords1[1]);
  const yA = new NumberNode(coords2[0]);
  const yB = new NumberNode(coords2[1]);

  let A: Point, B: Point;
  A = new Point("A", xA, xB);
  B = new Point("B", new NumberNode(-coords2[0]), new NumberNode(-coords2[1]));
  let wrongStatement = new SquareRoot(round(A.distanceTo(B) ** 2, 0))
    .simplify()
    .toTree()
    .toTex();
  tryToAddWrongProp(propositions, wrongStatement);

  A = new Point("A", xB, xA);
  B = new Point("B", yA, yB);
  wrongStatement = new SquareRoot(round(A.distanceTo(B) ** 2, 0))
    .simplify()
    .toTree()
    .toTex();
  tryToAddWrongProp(propositions, wrongStatement);

  A = new Point("A", xA, yA);
  B = new Point("B", xB, yB);
  wrongStatement = new SquareRoot(round(A.distanceTo(B) ** 2, 0))
    .simplify()
    .toTree()
    .toTex();
  tryToAddWrongProp(propositions, wrongStatement);

  while (propositions.length < n) {
    const [tempCoords1, tempsCoords2] = distinctRandTupleInt(2, 2, {
      from: -9,
      to: 10,
    });
    const A = new Point(
      "A",
      new NumberNode(tempCoords1[0]),
      new NumberNode(tempCoords1[1]),
    );
    const B = new Point(
      "B",
      new NumberNode(tempsCoords2[0]),
      new NumberNode(tempsCoords2[1]),
    );
    tryToAddWrongProp(
      propositions,
      new SquareRoot(round(A.distanceTo(B) ** 2, 0))
        .simplify()
        .toTree()
        .toTex(),
    );
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { coords1, coords2 }) => {
  const A = new Point(
    "A",
    new NumberNode(coords1[0]),
    new NumberNode(coords1[1]),
  );
  const B = new Point(
    "B",
    new NumberNode(coords2[0]),
    new NumberNode(coords2[1]),
  );
  const answer = new SqrtNode(new NumberNode(round(A.distanceTo(B) ** 2, 0)), {
    allowSimplifySqrt: true,
  });
  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};

export const distanceBetweenTwoPoints: Exercise<Identifiers> = {
  id: "distanceBetweenTwoPoints",
  connector: "=",
  label: "Distance entre deux points",
  levels: ["2nde", "1reESM"],
  sections: ["Géométrie cartésienne"],
  isSingleStep: false,
  generator: (nb: number) =>
    getDistinctQuestions(getDistanceBetweenTwoPoints, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
