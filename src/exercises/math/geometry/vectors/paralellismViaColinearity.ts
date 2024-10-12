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
import { Line } from "#root/math/geometry/line";
import { Point, PointConstructor } from "#root/math/geometry/point";
import { Vector, VectorConstructor } from "#root/math/geometry/vector";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { shuffle } from "#root/utils/alea/shuffle";

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

const getParalellismViaColinearityQuestion: QuestionGenerator<
  Identifiers
> = () => {
  let points: Point[] = [];
  do {
    points = PointConstructor.randomDifferent(["A", "B"]);
  } while (points[0].x.equals(points[1].x));

  const line = new Line(points[0], points[1]);
  let C: Point;
  do {
    C = PointConstructor.random("C");
  } while (line.includes(C));
  let D: Point;
  const coeff = new NumberNode(randint(-4, 4, [0]));

  const parallele = line.getParallele(C);
  const isParallele = coinFlip();
  if (isParallele) {
    D = VectorConstructor.fromPoints(points[0], points[1])
      .times(coeff)
      .getEndPoint(C, "D");
  } else {
    do {
      D = PointConstructor.random("D");
    } while (parallele.includes(D));
  }
  const answer = isParallele ? "Oui" : "Non";
  const question: Question<Identifiers> = {
    answer,
    instruction: `Soient les points $${points[0].toTexWithCoords()}$, $${points[1].toTexWithCoords()}$, $${C.toTexWithCoords()}$ et $${D.toTexWithCoords()}$. Les droites $(AB)$ et $(CD)$ sont-elles parallèles ?`,
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

export const paralellismViaColinearity: Exercise<Identifiers> = {
  id: "paralellismViaColinearity",
  label: "Utiliser la colinéarité pour déterminer un parallélisme",
  levels: ["2nde", "1reSpé"],
  isSingleStep: true,
  sections: ["Vecteurs", "Droites"],
  generator: (nb: number) =>
    getDistinctQuestions(getParalellismViaColinearityQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  answerType: "QCU",
  subject: "Mathématiques",
};
