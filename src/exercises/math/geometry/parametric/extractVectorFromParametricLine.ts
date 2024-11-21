import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  shuffleProps,
  GetAnswer,
  GetHint,
  GetCorrection,
  GetInstruction,
  GetKeys,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { ParametricLine } from "#root/math/geometry/parametricLine";
import { SpacePointConstructor } from "#root/math/geometry/spacePoint";
import { SpaceVectorConstructor } from "#root/math/geometry/spaceVector";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { spacePointParser } from "#root/tree/parsers/spacePointParser";
import { spaceVectorParser } from "#root/tree/parsers/spaceVectorParser";
import { doWhile } from "#root/utils/doWhile";

type Identifiers = {
  startPoint: number[];
  vector: number[];
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, startPoint, vector },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const lineVector = SpaceVectorConstructor.fromScalars(vector);
  while (propositions.length < n) {
    const vector = doWhile(
      () => SpaceVectorConstructor.random("A"),
      (v) => lineVector.isColinear(v),
    );
    tryToAddWrongProp(propositions, vector.toInlineCoordsTex());
  }
  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  const vector = SpaceVectorConstructor.fromScalars(identifiers.vector);
  return vector.toInlineCoordsTex();
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  const line = new ParametricLine(
    SpacePointConstructor.fromScalars(identifiers.startPoint),
    SpaceVectorConstructor.fromScalars(identifiers.vector),
  );

  return `Soit $d$ la droite d'équation paramétrique : 
  
$$
${line.toTex()}
$$

où $t\\in \\mathbb{R}$. 

Donner les coordonnées d'un vecteur directeur de la droite $d$.
  `;
};

// const getHint: GetHint<Identifiers> = (identifiers) => {
//   return `Il suffit de remplacer $t$ par une valeur afin d'obtenir les coordonnées d'un point de la droite.`;
// };
// const getCorrection: GetCorrection<Identifiers> = (identifiers) => {
//   const line = new ParametricLine(
//     SpacePointConstructor.fromScalars(identifiers.startPoint),
//     SpaceVectorConstructor.fromScalars(identifiers.vector),
//   );
//   const detailedEquations = line.toDetailedEvaluation(new NumberNode(0));
//   const point = line.getPointCoords(new NumberNode(0));
//   return `Pour obtenir les coordonnées d'un point appartenant à la droite, il suffit de remplacer $t$ par n'importe quelle valeur dans les trois équations. Par simplicité, prenons $t = 0$. On obtient alors :

// $$
// \\left\\{\\begin{matrix}
// x=${detailedEquations[0].toTex()} \\\\
// y=${detailedEquations[1].toTex()} \\\\
// z=${detailedEquations[2].toTex()}
// \\end{matrix}
// \\right.
// $$

// On en déduit que le point de coordonnées $\\left(${point
//     .map((e) => e.toTex())
//     .join(";")}\\right)$ appartient à la droite $d$.`;
// };

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return ["semicolon"];
};
const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, startPoint, vector },
) => {
  try {
    const v = SpaceVectorConstructor.fromScalars(vector);
    const vecAnswer = spaceVectorParser(ans);
    if (!vecAnswer) return false;
    return v.isColinear(vecAnswer);
  } catch (err) {
    return false;
  }
};

const getExtractVectorFromParametricLineQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const startPoint = SpacePointConstructor.random("A");
  const vector = SpaceVectorConstructor.random("B");

  const identifiers: Identifiers = {
    startPoint: startPoint.getEvaluatedCoords(),
    vector: vector.getEvaluatedCoords(),
  };
  const question: Question<Identifiers> = {
    answer: getAnswer(identifiers),
    instruction: getInstruction(identifiers),
    keys: getKeys(identifiers),
    answerFormat: "tex",
    identifiers,
    // hint: getHint(identifiers),
    // correction: getCorrection(identifiers),
  };

  return question;
};

export const extractVectorFromParametricLine: Exercise<Identifiers> = {
  id: "extractVectorFromParametricLine",
  connector: "=",
  label:
    "Trouver un vecteur directeur d'une droite à partir de son équation paramétrique",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getExtractVectorFromParametricLineQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  // getHint,
  // getCorrection,
  getAnswer,
};
