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
import { VectorConstructor } from "#root/math/geometry/vector";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { shuffle } from "#root/utils/alea/shuffle";

type Identifiers = {
  xA: number;
  xB: number;
  xC: number;
  yA: number;
  yB: number;
  yC: number;
};

const getAlignementViaColinearityQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const points = PointConstructor.randomDifferent(["A", "B"]);
  const AB = VectorConstructor.fromPoints(points[0], points[1]);
  let C: Point;
  const isAligned = coinFlip();
  const coeff = new NumberNode(randint(-4, 4, [0, 1]));
  if (isAligned) {
    C = AB.times(coeff).getEndPoint(points[0], "C");
  } else {
    do {
      C = PointConstructor.random("C");
    } while (AB.isColinear(VectorConstructor.fromPoints(points[0], C)));
  }

  const answer = isAligned ? "Oui" : "Non";
  const question: Question<Identifiers> = {
    answer,
    instruction: `Soient trois points $${points[0].toTexWithCoords()}$, $${points[1].toTexWithCoords()}$ et $${C.toTexWithCoords()}$. Les points $A$, $B$ et $C$ sont-ils alignés ?`,
    keys: [],
    answerFormat: "raw",
    identifiers: {
      xA: points[0].x.evaluate({}),
      xB: points[1].x.evaluate({}),
      xC: C.x.evaluate({}),
      yA: points[0].y.evaluate({}),
      yB: points[1].y.evaluate({}),
      yC: C.y.evaluate({}),
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

export const alignementViaColinearity: Exercise<Identifiers> = {
  id: "alignementViaColinearity",
  label: "Utiliser la colinéarité pour déterminer un alignement",
  levels: ["2nde", "1reSpé"],
  isSingleStep: true,
  sections: ["Vecteurs", "Droites"],
  generator: (nb: number) =>
    getDistinctQuestions(getAlignementViaColinearityQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  answerType: "QCU",
  subject: "Mathématiques",
};
