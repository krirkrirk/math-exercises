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
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";

type Identifiers = {
  affineA: number;
  affineB: number;
  power: number;
};

const getPowerCompositionDerivationQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const affine = AffineConstructor.random(undefined, { excludes: [0] });
  const affineTree = affine.toTree();
  const power = randint(3, 10);
  const powerTree = power.toTree();
  const fct = new PowerNode(affineTree, powerTree);
  const deriv = new MultiplyNode(
    (power * affine.a).toTree(),

    new PowerNode(affineTree, (power - 1).toTree()),
  );

  const question: Question<Identifiers> = {
    answer: deriv.toTex(),
    instruction: `Déterminer la dérivée de $f(x) = ${fct.toTex()}$`,
    keys: ["x"],
    answerFormat: "tex",
    identifiers: { affineA: affine.a, affineB: affine.b, power },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, affineA, affineB, power },
) => {
  console.log("qcm");
  const propositions: Proposition[] = [];
  const affineTree = new Affine(affineA, affineB).toTree();

  addValidProp(propositions, answer);
  const powerN = new PowerNode(affineTree, power.toTree());
  const powerNMinusOne = new PowerNode(affineTree, (power - 1).toTree());
  tryToAddWrongProp(
    propositions,
    new MultiplyNode(power.toTree(), powerNMinusOne).toTex(),
  );
  tryToAddWrongProp(
    propositions,
    new MultiplyNode(affineA.toTree(), powerN).toTex(),
  );
  tryToAddWrongProp(
    propositions,
    new MultiplyNode(affineA.toTree(), powerNMinusOne).toTex(),
  );
  tryToAddWrongProp(
    propositions,
    new MultiplyNode((power * affineA).toTree(), powerN).toTex(),
  );
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      new MultiplyNode(randint(-10, 10).toTree(), powerN).toTex(),
    );
    console.log("prop");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, power, affineA, affineB },
) => {
  const affineTree = new Affine(affineA, affineB).toTree();
  const deriv = new MultiplyNode(
    (power * affineA).toTree(),
    new PowerNode(affineTree, (power - 1).toTree()),
  );
  const texs = deriv.toAllValidTexs({ forbidPowerToProduct: true });
  return texs.includes(ans);
};
export const powerCompositionDerivation: MathExercise<Identifiers> = {
  id: "powerCompositionDerivation",
  connector: "=",
  label: "Dérivée de $\\left(ax+b\\right)^n$",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Dérivation"],
  generator: (nb: number) =>
    getDistinctQuestions(getPowerCompositionDerivationQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
