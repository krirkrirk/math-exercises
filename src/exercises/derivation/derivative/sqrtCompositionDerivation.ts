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
import { Affine, AffineConstructor } from "#root/math/polynomials/affine";
import { randint } from "#root/math/utils/random/randint";
import { SqrtNode } from "#root/tree/nodes/functions/sqrtNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";

type Identifiers = {
  affineA: number;
  affineB: number;
};

const getSqrtCompositionDerivationQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const affine = AffineConstructor.random();

  const fct = new SqrtNode(affine.toTree());
  const fraction = new FractionNode(
    affine.a.toTree(),
    new MultiplyNode((2).toTree(), fct),
  ).simplify();

  const question: Question<Identifiers> = {
    answer: fraction.toTex(),
    instruction: `Déterminer la dérivée de la fonction $f(x) = ${fct.toTex()}$`,
    keys: ["x"],
    answerFormat: "tex",
    identifiers: { affineA: affine.a, affineB: affine.b },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, affineA, affineB },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const affine = new Affine(affineA, affineB);
  const fct = new SqrtNode(affine.toTree());
  tryToAddWrongProp(
    propositions,
    new MultiplyNode(affineA.toTree(), fct).toTex(),
  );
  tryToAddWrongProp(
    propositions,
    new FractionNode(affine.a.toTree(), fct).simplify().toTex(),
  );
  tryToAddWrongProp(
    propositions,
    new SqrtNode(affineA.toTree()).simplify().toTex(),
  );
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      new FractionNode(
        randint(-10, 10).toTree(),
        new MultiplyNode((2).toTree(), fct),
      )
        .simplify()
        .toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, affineA, affineB }) => {
  const affine = new Affine(affineA, affineB);

  const fct = new SqrtNode(affine.toTree());
  const fraction = new FractionNode(
    affine.a.toTree(),
    new MultiplyNode((2).toTree(), fct),
  ).simplify();
  const texs = fraction.toAllValidTexs({
    allowFractionToDecimal: true,
    allowMinusAnywhereInFraction: true,
  });
  return texs.includes(ans);
};
export const sqrtCompositionDerivation: MathExercise<Identifiers> = {
  id: "sqrtCompositionDerivation",
  connector: "=",
  label: "Dérivée de $\\sqrt{ax+b}$",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Dérivation"],
  generator: (nb: number) =>
    getDistinctQuestions(getSqrtCompositionDerivationQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
