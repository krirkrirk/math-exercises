import {
  MathExercise,
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
import { Line } from "#root/math/geometry/line";
import { Point, PointConstructor } from "#root/math/geometry/point";
import { VectorConstructor } from "#root/math/geometry/vector";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
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

const getParallelogramViaEqualVectorsQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const points = PointConstructor.randomDifferent(["A", "B"]);
  const AB = VectorConstructor.fromPoints(points[0], points[1]);
  let D: Point;
  do {
    console.log(
      `1 : points: ${points.map((p) =>
        p.toCoords(),
      )}, vec : ${AB.x.toTex()} et ${AB.y.toTex()}`,
    );
    D = PointConstructor.random("D");
  } while (AB.isColinear(VectorConstructor.fromPoints(D, points[0])));
  let C: Point;
  const isParallelogram = coinFlip();
  if (isParallelogram) {
    C = AB.getEndPoint(D, "C");
  } else {
    do {
      console.log("2");

      C = PointConstructor.random("C");
    } while (AB.equals(VectorConstructor.fromPoints(D, C)));
  }
  const answer = isParallelogram ? "Oui" : "Non";
  const question: Question<Identifiers> = {
    answer,
    instruction: `Soient les points $${points[0].toTexWithCoords()}$, $${points[1].toTexWithCoords()}$, $${C.toTexWithCoords()}$ et $${D.toTexWithCoords()}$. $ABCD$ est-il un parallélogramme ?`,
    keys: [],
    answerFormat: "raw",
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

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");
  tryToAddWrongProp(propositions, "Oui", "raw");
  tryToAddWrongProp(propositions, "Non", "raw");
  tryToAddWrongProp(propositions, "On ne peut pas savoir", "raw");
  return shuffle(propositions);
};

export const parallelogramViaEqualVectors: MathExercise<Identifiers> = {
  id: "parallelogramViaEqualVectors",
  label: "Utiliser les vecteurs pour reconnaître un parallélogramme",
  levels: ["2nde", "1reSpé"],
  isSingleStep: true,
  sections: ["Vecteurs", "Droites"],
  generator: (nb: number) =>
    getDistinctQuestions(getParallelogramViaEqualVectorsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  answerType: "QCM",
};
