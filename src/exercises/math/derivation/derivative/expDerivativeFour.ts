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
import { Affine, AffineConstructor } from "#root/math/polynomials/affine";
import { ExpNode } from "#root/tree/nodes/functions/expNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";

type Identifiers = {
  affine1Coeffs: number[];
  affine2Coeffs: number[];
};

const getExpDerivativeFourQuestion: QuestionGenerator<Identifiers> = () => {
  const affine1 = AffineConstructor.random();
  const affine2 = AffineConstructor.random();
  const exp = new ExpNode(affine2.toTree());
  const fct = new MultiplyNode(affine1.toTree(), exp);
  const deriv = new MultiplyNode(
    new Affine(
      affine2.a * affine1.a,
      affine1.a + affine2.a * affine1.b,
    ).toTree(),
    exp,
  );
  //ae^cx+d  + c(ax+b)e^cx+d = (a+c(ax+b))e^cx+d = (cax + a +cb) e^cx+d
  const question: Question<Identifiers> = {
    answer: deriv.toTex(),
    instruction: `Déterminer la dérivée de la fonction $f(x) = ${fct.toTex()}$`,
    keys: ["x", "exp"],
    answerFormat: "tex",
    identifiers: {
      affine1Coeffs: affine1.coefficients,
      affine2Coeffs: affine2.coefficients,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      new MultiplyNode(
        AffineConstructor.random().toTree(),
        new ExpNode(AffineConstructor.random().toTree()),
      ).toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, affine1Coeffs, affine2Coeffs },
) => {
  const affine1 = new Affine(affine1Coeffs[1], affine1Coeffs[0]);
  const affine2 = new Affine(affine2Coeffs[1], affine2Coeffs[0]);

  const exp = new ExpNode(affine2.toTree());
  const deriv = new MultiplyNode(
    new Affine(
      affine2.a * affine1.a,
      affine1.a + affine2.a * affine1.b,
    ).toTree(),
    exp,
  );
  const texs = deriv.toAllValidTexs();
  return texs.includes(ans);
};
export const expDerivativeFour: Exercise<Identifiers> = {
  id: "expDerivativeFour",
  connector: "=",
  label: "Dérivée de $(ax+b)e^{cx+d}$",
  levels: ["1reSpé", "TermSpé", "MathComp"],
  isSingleStep: true,
  sections: ["Dérivation", "Exponentielle"],
  generator: (nb: number) =>
    getDistinctQuestions(getExpDerivativeFourQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
