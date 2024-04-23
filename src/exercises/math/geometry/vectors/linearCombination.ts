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
import { Vector, VectorConstructor } from "#root/math/geometry/vector";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";

type Identifiers = {
  a: NumberNode;
  b: NumberNode;
  u: Vector;
  v: Vector;
};

const getLinearCombinationQuestion: QuestionGenerator<Identifiers> = () => {
  const u = VectorConstructor.random("u", true);
  const v = VectorConstructor.random("v", true);
  const a = new NumberNode(randint(-10, 11));
  const b = new NumberNode(randint(-10, 11));

  const instruction = `Soient $u$ et $v$ , deux vecteurs de coordonnées respectives $(${u.toTexWithCoords()}), (${v.toTexWithCoords()})$. 
  Calculer la combinaison linéaire $${a.toTex()}u + ${b.toTex()}v$`;

  const aU = u.times(a);
  const bV = v.times(b);
  const correctAnswer = aU.add(bV);

  const question: Question<Identifiers> = {
    answer: `$${correctAnswer.toTexWithCoords()}$`,
    instruction: instruction,
    keys: ["u", "v"],
    answerFormat: "tex",
    identifiers: { a, b, u, v },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, a, b, u, v },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  generatePropositions(a, u, b, v).forEach((value) =>
    tryToAddWrongProp(propositions, value.toTexWithCoords()),
  );

  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      calculateLinearCombination(
        randint(-11, 10, [a.value]),
        b.value,
        u,
        v,
      ).toTexWithCoords(),
    );
    tryToAddWrongProp(
      propositions,
      calculateLinearCombination(
        a.value,
        randint(-11, 11, [b.value]),
        u,
        v,
      ).toTexWithCoords(),
    );
  }
  return shuffleProps(propositions, n);
};

const calculateLinearCombination = (
  a: number,
  b: number,
  u: Vector,
  v: Vector,
): Vector => {
  const aU = u.times(new NumberNode(a));
  const bV = v.times(new NumberNode(b));
  return aU.add(bV);
};

const generatePropositions = (
  a: NumberNode,
  u: Vector,
  b: NumberNode,
  v: Vector,
): Vector[] => {
  const firstProposition = u.times(b).add(v.times(a));
  const secondProposition = u.times(a).add(v.times(new NumberNode(-b)));
  const aU = u.times(a);
  const bV = v.times(b);
  const thirdProposition = new Vector(
    "au+bv",
    new AddNode(aU.x, bV.y).simplify(),
    new AddNode(aU.y, bV.x).simplify(),
  );
  return [firstProposition, secondProposition, thirdProposition];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  throw Error("VEA not implemented");
};
export const linearCombination: Exercise<Identifiers> = {
  id: "linearCombination",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getLinearCombinationQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
