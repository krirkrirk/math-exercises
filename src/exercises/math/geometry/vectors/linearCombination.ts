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
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";

type Identifiers = {
  a: NumberNode;
  b: NumberNode;
  u: Vector;
  v: Vector;
};

const getLinearCombinationQuestion: QuestionGenerator<Identifiers> = () => {
  const u = VectorConstructor.random("u", true);
  const v = VectorConstructor.random("v", true);
  const a = new NumberNode(randint(-10, 11, [0]));
  const b = new NumberNode(randint(-10, 11, [0]));

  const instruction = `Soient $${u.toTex()}$ et $${v.toTex()}$ , deux vecteurs de coordonnées respectives $${u.toTexWithCoords()}, ${v.toTexWithCoords()}$. 
  Calculer les coordonnées du vecteur $${getAddVectorTex(
    getMultiplyVectorTex(a, u),
    getMultiplyVectorTex(b, v),
  )}$`;
  const aUPlusBv = calculateLinearCombination(a, b, u, v);
  const correctAnswer = new Vector("au+bv", aUPlusBv.x, aUPlusBv.y);

  const question: Question<Identifiers> = {
    answer: `${correctAnswer.toInlineCoordsTex()}`,
    instruction: instruction,
    keys: ["semicolon", "comma"],
    answerFormat: "tex",
    identifiers: { a, b, u, v },
  };

  return question;
};

const getMultiplyVectorTex = (a: NumberNode, u: Vector): string => {
  if (Math.abs(a.value) === 1)
    return a.value === -1 ? `-${u.toTex()}` : u.toTex();
  return a.toTex() + u.toTex();
};

const getAddVectorTex = (u: string, v: string): string => {
  return v.charAt(0) === "-" ? u + v : `${u}+${v}`;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, a, b, u, v },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  generateProposition(a, b, u, v).forEach((value) =>
    tryToAddWrongProp(propositions, value.toInlineCoordsTex()),
  );
  let aRandom;
  let bRandom;
  while (propositions.length < n) {
    aRandom = new NumberNode(randint(a.value - 2, a.value + 3, [a.value]));
    bRandom = new NumberNode(randint(b.value - 2, b.value + 3, [b.value]));
    tryToAddWrongProp(
      propositions,
      calculateLinearCombination(aRandom, b, u, v).toInlineCoordsTex(),
    );
    tryToAddWrongProp(
      propositions,
      calculateLinearCombination(a, bRandom, u, v).toInlineCoordsTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const calculateLinearCombination = (
  a: NumberNode,
  b: NumberNode,
  u: Vector,
  v: Vector,
): Vector => {
  const aUPlusBv = u.times(a).add(v.times(b));
  return new Vector("au+bv", aUPlusBv.x, aUPlusBv.y);
};

const generateProposition = (
  a: NumberNode,
  b: NumberNode,
  v: Vector,
  u: Vector,
): Vector[] => {
  let aU = new Vector("au", new MultiplyNode(a, u.x).simplify(), u.y);
  let bV = new Vector("bv", new MultiplyNode(b, v.x).simplify(), v.y);
  let aUPlusbV = aU.add(bV);
  const firtPropostion = new Vector("au+bv", aUPlusbV.x, aUPlusbV.y);

  aU.y = new MultiplyNode(a, u.y).simplify();
  bV.y = new MultiplyNode(b, v.y).simplify();
  aUPlusbV = aU.add(bV);
  const secondProposition = new Vector("au+bv", aUPlusbV.x, aUPlusbV.y);

  return [firtPropostion, secondProposition];
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  const ansSplitted = answer.split(";");
  return answer === ans || ans === `${ansSplitted[0]},${ansSplitted[1]}`;
};
export const linearCombination: Exercise<Identifiers> = {
  id: "linearCombination",
  label:
    "Calcul des coordonnées du vecteur $a\\overrightarrow{u} + b\\overrightarrow{v}",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Vecteurs"],
  generator: (nb: number) =>
    getDistinctQuestions(getLinearCombinationQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
