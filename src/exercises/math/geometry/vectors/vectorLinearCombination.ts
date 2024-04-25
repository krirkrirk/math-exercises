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
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { CANCELLED } from "dns";

type Identifiers = {
  a: number;
  b: number;
  u: VectorCoords;
  v: VectorCoords;
};

type VectorCoords = {
  x: number;
  y: number;
};

const getVectorLinearCombinationQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const u = VectorConstructor.random("u", true);
  const v = VectorConstructor.random("v", true);
  const a = randint(-10, 11, [0]);
  const b = randint(-10, 11, [0]);

  const uCoords = {
    x: (u.x as NumberNode).simplify().value,
    y: (u.y as NumberNode).simplify().value,
  };
  const vCoords = {
    x: (v.x as NumberNode).simplify().value,
    y: (v.y as NumberNode).simplify().value,
  };

  const instruction = `Soient deux vecteurs $${u.toTexWithCoords()}$ et $${v.toTexWithCoords()}$. 
  Calculer les coordonnées du vecteur $${getAddVectorTex(
    getMultiplyVectorTex(a, u),
    getMultiplyVectorTex(b, v),
  )}$`;
  const aUPlusBv = calculateLinearCombination(a, b, u, v);
  const correctAnswer = new Vector("au+bv", aUPlusBv.x, aUPlusBv.y);

  const question: Question<Identifiers> = {
    answer: `${correctAnswer.toInlineCoordsTex()}`,
    instruction: instruction,
    keys: ["semicolon"],
    answerFormat: "tex",
    identifiers: { a, b, u: uCoords, v: vCoords },
  };

  return question;
};

const getMultiplyVectorTex = (a: number, u: Vector): string => {
  const node = new MultiplyNode(new NumberNode(a), new VariableNode(u.toTex()));
  return node.simplify().toTex();
};

const getAddVectorTex = (u: string, v: string): string => {
  return new AddNode(new VariableNode(u), new VariableNode(v))
    .simplify()
    .toTex();
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, a, b, u, v },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const uVector = new Vector("u", new NumberNode(u.x), new NumberNode(u.y));
  const vVector = new Vector("v", new NumberNode(v.x), new NumberNode(v.y));

  generateProposition(a, b, uVector, vVector).forEach((value) =>
    tryToAddWrongProp(propositions, value.toInlineCoordsTex()),
  );
  let aRandom;
  let bRandom;
  while (propositions.length < n) {
    aRandom = randint(a - 2, a + 3, [a]);
    bRandom = randint(b - 2, b + 3, [b]);
    tryToAddWrongProp(
      propositions,
      calculateLinearCombination(
        aRandom,
        b,
        uVector,
        vVector,
      ).toInlineCoordsTex(),
    );
    tryToAddWrongProp(
      propositions,
      calculateLinearCombination(
        a,
        bRandom,
        uVector,
        vVector,
      ).toInlineCoordsTex(),
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
  const aNode = new NumberNode(a);
  const bNode = new NumberNode(b);
  const aUPlusBv = u.times(aNode).add(v.times(bNode));
  return new Vector("au+bv", aUPlusBv.x, aUPlusBv.y);
};

const generateProposition = (
  a: number,
  b: number,
  v: Vector,
  u: Vector,
): Vector[] => {
  const aNode = new NumberNode(a);
  const bNode = new NumberNode(b);
  let aU = new Vector("au", new MultiplyNode(aNode, u.x).simplify(), u.y);
  let bV = new Vector("bv", new MultiplyNode(bNode, v.x).simplify(), v.y);
  let aUPlusbV = aU.add(bV);
  const firtPropostion = new Vector("au+bv", aUPlusbV.x, aUPlusbV.y);

  aU.y = new MultiplyNode(aNode, u.y).simplify();
  bV.y = new MultiplyNode(bNode, v.y).simplify();
  aU.x = u.x;
  bV.x = v.x;
  aUPlusbV = aU.add(bV);
  const secondProposition = new Vector("au+bv", aUPlusbV.x, aUPlusbV.y);

  return [firtPropostion, secondProposition];
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return [answer, answer.replace(";", ",")].includes(ans);
};
export const vectorLinearCombination: Exercise<Identifiers> = {
  id: "vectorLinearCombination",
  label:
    "Calcul des coordonnées du vecteur $a\\overrightarrow{u} + b\\overrightarrow{v}$",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Vecteurs"],
  generator: (nb: number) =>
    getDistinctQuestions(getVectorLinearCombinationQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
