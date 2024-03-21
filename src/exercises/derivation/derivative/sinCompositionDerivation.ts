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
import { CosNode } from "#root/tree/nodes/functions/cosNode";
import { OppositeNode } from "#root/tree/nodes/functions/oppositeNode";
import { SinNode } from "#root/tree/nodes/functions/sinNode";
import { SqrtNode } from "#root/tree/nodes/functions/sqrtNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";

type Identifiers = {
  affineA: number;
  affineB: number;
};

const getSinCompositionDerivationQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const affine = AffineConstructor.random(undefined, { excludes: [0] });

  const fct = new SinNode(affine.toTree());
  const deriv = new MultiplyNode(
    affine.a.toTree(),
    new CosNode(affine.toTree()),
  );

  const question: Question<Identifiers> = {
    answer: deriv.toTex(),
    instruction: `Déterminer la dérivée de la fonction $f(x) = ${fct.toTex()}$`,
    keys: ["x", "sin", "cos", "tan"],
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
  const affineTree = affine.toTree();
  const sin = new SinNode(affineTree);
  const cos = new CosNode(affineTree);
  tryToAddWrongProp(
    propositions,
    new MultiplyNode(affineA.toTree(), sin).toTex(),
  );
  tryToAddWrongProp(propositions, cos.toTex());
  tryToAddWrongProp(
    propositions,
    new MultiplyNode((-affineA).toTree(), cos).toTex(),
  );

  tryToAddWrongProp(propositions, new OppositeNode(cos).toTex());
  tryToAddWrongProp(
    propositions,
    new SinNode(affineA.toTree()).simplify().toTex(),
  );
  tryToAddWrongProp(
    propositions,
    new CosNode(affineA.toTree()).simplify().toTex(),
  );
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, affineA, affineB }) => {
  const affine = new Affine(affineA, affineB);

  const deriv = new MultiplyNode(
    affineA.toTree(),
    new CosNode(affine.toTree()),
  );

  const texs = deriv.toAllValidTexs();
  return texs.includes(ans);
};
export const sinCompositionDerivation: MathExercise<Identifiers> = {
  id: "sinCompositionDerivation",
  connector: "=",
  label: "Dérivée de $\\sin(ax+b)$",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Dérivation"],
  generator: (nb: number) =>
    getDistinctQuestions(getSinCompositionDerivationQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
