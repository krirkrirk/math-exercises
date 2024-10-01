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
import { Integer } from "#root/math/numbers/integer/integer";
import { Affine, AffineConstructor } from "#root/math/polynomials/affine";
import { Polynomial } from "#root/math/polynomials/polynomial";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SquareNode } from "#root/tree/nodes/operators/powerNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { alignTex } from "#root/utils/alignTex";
import { shuffle } from "#root/utils/shuffle";
import { v4 } from "uuid";
type Identifiers = {
  affine1Coeffs: number[];
  affine2Coeffs: number[];
};

export const getThirdIdentityQuestion: QuestionGenerator<Identifiers> = () => {
  const affine = AffineConstructor.random(undefined, { excludes: [0] });
  const affine2 = new Affine(affine.a, -affine.b);
  const statementTree = new MultiplyNode(affine.toTree(), affine2.toTree());
  const answer = affine.multiply(affine2).toTree().toTex();

  const aMonom = new MultiplyNode(affine.a.toTree(), "x".toTree());
  const bPositive = Math.abs(affine.b);
  const statementTex = statementTree.toTex();
  const question: Question<Identifiers> = {
    instruction: `Développer et réduire : $${statementTex}$`,
    startStatement: statementTex,
    answer,
    keys: ["x"],
    answerFormat: "tex",
    identifiers: {
      affine1Coeffs: affine.coefficients,
      affine2Coeffs: affine2.coefficients,
    },
    hint: `Utilise l'identité remarquable $(a-b)(a+b) = a^2 - b^2$ en prenant $a=${aMonom.toTex()}$ et $b=${bPositive}$`,
    correction: `
On utilise l'identité remarquable $(a-b)(a+b) = a^2 - b^2$ en prenant $a=${aMonom.toTex()}$ et $b=${bPositive}$ : 

${alignTex([
  [
    statementTex,
    "=",

    new SubstractNode(
      new SquareNode(aMonom),
      new SquareNode(bPositive.toTree()),
    ).toTex(),
  ],
  ["", "=", answer],
])}`,
  };
  return question;
};

export const getThirdIdentityPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, affine1Coeffs, affine2Coeffs },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const affine = new Affine(affine1Coeffs[1], affine1Coeffs[0]);
  const affine2 = new Affine(affine2Coeffs[1], affine2Coeffs[0]);
  tryToAddWrongProp(
    propositions,
    affine.multiply(affine2.opposite()).toTree().toTex(),
  );
  tryToAddWrongProp(propositions, affine.multiply(affine).toTree().toTex());
  tryToAddWrongProp(
    propositions,
    affine2.multiply(affine2.opposite()).toTree().toTex(),
  );

  while (propositions.length < n) {
    const affineTemp = AffineConstructor.random(undefined, {
      excludes: [0],
    });
    const affineTemp2 = new Affine(affineTemp.a, -affineTemp.b);
    const wrongAnswer = affineTemp.multiply(affineTemp2).toTree();
    tryToAddWrongProp(propositions, wrongAnswer.toTex());
  }
  return shuffle(propositions);
};

export const isThirdIdentityAnswerValid: VEA<Identifiers> = (
  ans,
  { affine1Coeffs, affine2Coeffs },
) => {
  const affine = new Affine(affine1Coeffs[1], affine1Coeffs[0]);
  const affine2 = new Affine(affine2Coeffs[1], affine2Coeffs[0]);
  const answer = affine.multiply(affine2).toTree();

  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};

export const thirdIdentity: Exercise<Identifiers> = {
  id: "idRmq3",
  connector: "=",
  label: "Identité remarquable $(a+b)(a-b)$",
  levels: ["3ème", "2nde"],
  sections: ["Calcul littéral"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getThirdIdentityQuestion, nb),
  getPropositions: getThirdIdentityPropositions,
  isAnswerValid: isThirdIdentityAnswerValid,
  qcmTimer: 60,
  freeTimer: 60,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
