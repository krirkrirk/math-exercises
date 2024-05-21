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
import { TrinomConstructor } from "#root/math/polynomials/trinom";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { CosNode } from "#root/tree/nodes/functions/cosNode";
import { SinNode } from "#root/tree/nodes/functions/sinNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { secondDegreeDerivative } from "./secondDegreeDerivative";

type Identifiers = {
  affinecoeffs: number[];
};

const getSinSecondDegreeDerivativeQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const affine = AffineConstructor.random();
  const affinecoeffs = affine.coefficients;

  const ans = new MultiplyNode(
    new MultiplyNode(
      new PowerNode(affinecoeffs[1].toTree(), new NumberNode(2)),
      new NumberNode(-1),
    ),
    new SinNode(affine.toTree().simplify({ forbidFactorize: true })),
  )
    .simplify()
    .toTex();
  const func = new SinNode(
    affine.toTree().simplify({ forbidFactorize: true }),
  ).toTex();
  const question: Question<Identifiers> = {
    answer: ans,
    instruction: `Calculez la dérivée seconde de la fonction $f(x) = ${func}$.`,
    keys: ["x", "sin", "cos", "tan"],
    answerFormat: "tex",
    identifiers: { affinecoeffs },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, affinecoeffs },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const affine = new AddNode(
    new MultiplyNode(new NumberNode(affinecoeffs[1]), new VariableNode("x")),
    new NumberNode(affinecoeffs[0]),
  ).simplify({ forbidFactorize: true });

  const wronganswer1 = new MultiplyNode(
    new PowerNode(affinecoeffs[1].toTree(), new NumberNode(2)),
    new SinNode(affine),
  )
    .simplify()
    .toTex();

  const wronganswer2 = new MultiplyNode(
    new MultiplyNode(
      new PowerNode(affinecoeffs[1].toTree(), new NumberNode(2)),
      new NumberNode(-1),
    ),
    new CosNode(affine),
  )
    .simplify()
    .toTex();

  const wronganswer3 = new MultiplyNode(
    affinecoeffs[1].toTree(),
    new CosNode(affine),
  )
    .simplify()
    .toTex();

  const wronganswer4 = new MultiplyNode(
    affinecoeffs[1].toTree(),
    new SinNode(affine),
  )
    .simplify()
    .toTex();

  const wronganswer5 = affine.toTex();

  tryToAddWrongProp(propositions, wronganswer1);
  tryToAddWrongProp(propositions, wronganswer2);
  tryToAddWrongProp(propositions, wronganswer3);
  tryToAddWrongProp(propositions, wronganswer4);
  tryToAddWrongProp(propositions, wronganswer5);

  while (propositions.length < n) {
    const random = AffineConstructor.random();
    const randomwronganswer = new MultiplyNode(
      random.a.toTree(),
      new CosNode(random.toTree().simplify({ forbidFactorize: true })),
    )
      .simplify()
      .toTex();
    tryToAddWrongProp(propositions, randomwronganswer);
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, affinecoeffs }) => {
  const affine = new AddNode(
    new MultiplyNode(new NumberNode(affinecoeffs[1]), new VariableNode("x")),
    new NumberNode(affinecoeffs[0]),
  ).simplify({ forbidFactorize: true });

  const validanswer = new MultiplyNode(
    new MultiplyNode(
      new PowerNode(new NumberNode(affinecoeffs[1]), new NumberNode(2)),
      new NumberNode(-1),
    ),
    new SinNode(affine),
  ).simplify();

  const latexs = validanswer.toAllValidTexs();

  return latexs.includes(ans);
};

export const sinSecondDegreeDerivative: Exercise<Identifiers> = {
  id: "sinSecondDegreeDerivative",
  label: "Dérivée seconde de $\\sin(u)$",
  levels: ["TermSpé"],
  isSingleStep: true,
  sections: ["Dérivation"],
  generator: (nb: number) =>
    getDistinctQuestions(getSinSecondDegreeDerivativeQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
