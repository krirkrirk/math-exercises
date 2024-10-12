import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Point } from "#root/math/geometry/point";
import { distinctRandTupleInt } from "#root/math/utils/random/randTupleInt";
import { PointNode } from "#root/tree/nodes/geometry/pointNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { shuffle } from "#root/utils/alea/shuffle";

type Identifiers = {
  coordsA: number[];
  coordsB: number[];
};

const getMidpointQuestion: QuestionGenerator<Identifiers> = () => {
  const [coords1, coords2] = distinctRandTupleInt(2, 2, { from: -9, to: 10 });
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

  const answer = A.midpoint(B).toTexWithCoords();
  const question: Question<Identifiers> = {
    instruction: `Soit $${A.toTexWithCoords()}$ et $${B.toTexWithCoords()}$. Quelles sont les coordonnées du milieu $I$ de $[AB]$ ?`,
    startStatement: "I",
    answer,
    keys: ["I", "semicolon"],
    answerFormat: "tex",
    identifiers: { coordsA: coords1, coordsB: coords2 },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    const [tempCoords1, tempsCoords2] = distinctRandTupleInt(2, 2, {
      from: -9,
      to: 10,
    });
    const temps1 = new Point(
      "A",
      new NumberNode(tempCoords1[0]),
      new NumberNode(tempCoords1[1]),
    );
    const temps2 = new Point(
      "B",
      new NumberNode(tempsCoords2[0]),
      new NumberNode(tempsCoords2[1]),
    );
    const wrongAnswer = temps1.midpoint(temps2);
    tryToAddWrongProp(propositions, wrongAnswer.toTexWithCoords());
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { coordsA, coordsB }) => {
  const A = new Point(
    "A",
    new NumberNode(coordsA[0]),
    new NumberNode(coordsA[1]),
  );
  const B = new Point(
    "B",
    new NumberNode(coordsB[0]),
    new NumberNode(coordsB[1]),
  );

  const answer = new PointNode(A.midpoint(B), {
    allowFractionToDecimal: true,
  });
  const texs = answer.toAllValidTexs();

  return texs.includes(ans);
};
export const midpoint: Exercise<Identifiers> = {
  id: "midpoint",
  connector: "=",
  label: "Coordonnées du milieu",
  levels: ["3ème", "2nde"],
  isSingleStep: false,
  sections: ["Géométrie cartésienne"],
  generator: (nb: number) => getDistinctQuestions(getMidpointQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
