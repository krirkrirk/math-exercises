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
import { coordinatesKeys } from "#root/exercises/utils/keys/coordinatesKeys";
import { equationKeys } from "#root/exercises/utils/keys/equationKeys";
import { Point, PointConstructor } from "#root/math/geometry/point";
import { Vector, VectorConstructor } from "#root/math/geometry/vector";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { coinFlip } from "#root/utils/coinFlip";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  xA: number;
  xB: number;
  xC: number;
  xD: number;
  yA: number;
  yB: number;
  yC: number;
  yD: number;
};

const getFourthParallelogramPointQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const points = PointConstructor.randomDifferent(["A", "B"]);
  const AB = VectorConstructor.fromPoints(points[0], points[1]);
  let D: Point;
  do {
    D = PointConstructor.random("D");
  } while (AB.isColinear(VectorConstructor.fromPoints(D, points[0])));
  const C = AB.getEndPoint(D, "C");
  const answer = D.toCoords();
  const question: Question<Identifiers> = {
    answer,
    instruction: `Soient les points $${points[0].toTexWithCoords()}$, $${points[1].toTexWithCoords()}$, et $${C.toTexWithCoords()}$. Quelles sont les coordonnées du point $D$ tel que $ABCD$ soit un parallélogramme ?`,
    keys: coordinatesKeys,
    answerFormat: "tex",
    identifiers: {
      xA: points[0].x.evaluate({}),
      xB: points[1].x.evaluate({}),
      xC: C.x.evaluate({}),
      xD: D.x.evaluate({}),
      yA: points[0].y.evaluate({}),
      yB: points[1].y.evaluate({}),
      yC: C.y.evaluate({}),
      yD: D.y.evaluate({}),
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, xA, xB, xC, yA, yB, yC, yD },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "tex");
  const AB = new Vector("u", new NumberNode(xB - xA), new NumberNode(yB - yA));
  const C = new Point("C", new NumberNode(xC), new NumberNode(yC));
  const fakeD = AB.getEndPoint(C);
  tryToAddWrongProp(propositions, fakeD.toCoords());
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      `\\left(${randint(-10, 10)};${randint(-10, 10)}\\right)`,
    );
  }
  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return [ans, ans.replace(",", ";"), "\\left(" + ans + "\\right)"].includes(
    answer,
  );
};
export const fourthParallelogramPoint: MathExercise<Identifiers> = {
  id: "fourthParallelogramPoint",
  label: "Déterminer les coordonnées du quatrième point d'un parallélogramme",
  levels: ["2nde", "1reSpé"],
  isSingleStep: true,
  sections: ["Vecteurs", "Droites"],
  generator: (nb: number) =>
    getDistinctQuestions(getFourthParallelogramPointQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
