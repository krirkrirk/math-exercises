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
  affine: Affine;
};

const getCosSecondDegreeDerivativeQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const affine = AffineConstructor.random();
  const ans = new MultiplyNode(
    new MultiplyNode(
      new PowerNode(affine.a.toTree(), new NumberNode(2)),
      new NumberNode(-1),
    ),
    new CosNode(affine.toTree()),
  )
    .simplify()
    .toTex();

  const question: Question<Identifiers> = {
    answer: ans,
    instruction: `Calculer la dérivée seconde de $cos(${affine.toTex()})$`,
    keys: ["x", "sin", "cos", "tan"],
    answerFormat: "tex",
    identifiers: { affine },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, affine }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const wronganswer1 = new MultiplyNode(
    new PowerNode(affine.a.toTree(), new NumberNode(2)),
    new CosNode(affine.toTree()),
  )
    .simplify()
    .toTex();

  const wronganswer2 = new MultiplyNode(
    new MultiplyNode(
      new PowerNode(affine.a.toTree(), new NumberNode(2)),
      new NumberNode(-1),
    ),
    new SinNode(affine.toTree()),
  )
    .simplify()
    .toTex();

  const wronganswer3 = new MultiplyNode(
    affine.a.toTree(),
    new SinNode(affine.toTree()),
  )
    .simplify()
    .toTex();

  const wronganswer4 = new MultiplyNode(
    affine.a.toTree(),
    new CosNode(affine.toTree()),
  )
    .simplify()
    .toTex();

  const wronganswer5 = affine.toTree().toTex();

  tryToAddWrongProp(propositions, wronganswer1);
  tryToAddWrongProp(propositions, wronganswer2);
  tryToAddWrongProp(propositions, wronganswer3);
  tryToAddWrongProp(propositions, wronganswer4);
  tryToAddWrongProp(propositions, wronganswer5);

  while (propositions.length < n) {
    const random = AffineConstructor.random();
    const randomwronganswer = new MultiplyNode(
      random.a.toTree(),
      new SinNode(affine.toTree()),
    )
      .simplify()
      .toTex();
    tryToAddWrongProp(propositions, randomwronganswer);
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, affine }) => {
  const validequation = new MultiplyNode(
    new MultiplyNode(
      new PowerNode(new NumberNode(affine.a), new NumberNode(2)),
      new NumberNode(-1),
    ),
    new CosNode(
      new AddNode(
        new MultiplyNode(new NumberNode(affine.a), new VariableNode("x")),
        new NumberNode(affine.b),
      ),
    ),
  ).simplify();

  const latexs = validequation.toAllValidTexs();

  return latexs.includes(ans);
};

export const cosSecondDegreeDerivative: Exercise<Identifiers> = {
  id: "cosSecondDegreeDerivative",
  label: "Dérivée seconde de cos(u)",
  levels: ["TermSpé"],
  isSingleStep: true,
  sections: ["Dérivation"],
  generator: (nb: number) =>
    getDistinctQuestions(getCosSecondDegreeDerivativeQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};