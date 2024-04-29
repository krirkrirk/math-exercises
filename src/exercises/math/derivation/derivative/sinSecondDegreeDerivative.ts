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
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { secondDegreeDerivative } from "./secondDegreeDerivative";

type Identifiers = {
  affine: Affine;
};

const getSinSecondDegreeDerivativeQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const affine = AffineConstructor.random();
  const power = 2;
  const ans = new EqualNode(
    new VariableNode("f''(u)"),
    new MultiplyNode(
      new PowerNode((-affine.a).toTree(), power.toTree()),
      new SinNode(affine.toTree()),
    ).simplify(),
  ).toTex();

  const question: Question<Identifiers> = {
    answer: ans,
    instruction: `Calculer la dérivée seconde de $sin(${affine.toTex()})$`,
    keys: ["x", "u", "sin", "cos", "tan", "f"],
    answerFormat: "tex",
    identifiers: { affine },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, affine }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const power = 2;

  const wronganswer1 = new EqualNode(
    new VariableNode("f''(u)"),
    new MultiplyNode(
      new PowerNode(affine.a.toTree(), power.toTree()),
      new SinNode(affine.toTree()),
    ).simplify(),
  ).toTex();

  const wronganswer2 = new EqualNode(
    new VariableNode("f''(u)"),
    new MultiplyNode(
      new PowerNode((-affine.a).toTree(), power.toTree()),
      new CosNode(affine.toTree()),
    ).simplify(),
  ).toTex();

  const wronganswer3 = new EqualNode(
    new VariableNode("f''(u)"),
    new MultiplyNode(
      affine.a.toTree(),
      new CosNode(affine.toTree()),
    ).simplify(),
  ).toTex();

  const wronganswer4 = new EqualNode(
    new VariableNode("f''(u)"),
    new MultiplyNode(
      affine.a.toTree(),
      new SinNode(affine.toTree()),
    ).simplify(),
  ).toTex();

  const wronganswer5 = affine.toTex();

  tryToAddWrongProp(propositions, wronganswer1);
  tryToAddWrongProp(propositions, wronganswer2);
  tryToAddWrongProp(propositions, wronganswer3);
  tryToAddWrongProp(propositions, wronganswer4);
  tryToAddWrongProp(propositions, wronganswer5);

  while (propositions.length < n) {
    const random = AffineConstructor.random();
    const randomwronganswer = new EqualNode(
      new VariableNode("f''(u)"),
      new MultiplyNode(
        random.a.toTree(),
        new CosNode(affine.toTree()),
      ).simplify(),
    ).toTex();
    tryToAddWrongProp(propositions, randomwronganswer);
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, affine }) => {
  const power = 2;
  const validequation = new EqualNode(
    new VariableNode("f''(u)"),
    new MultiplyNode(
      new PowerNode((-affine.a).toTree(), power.toTree()),
      new SinNode(affine.toTree()),
    ).simplify(),
  );

  const latexs = validequation.toAllValidTexs({
    allowRawRightChildAsSolution: true,
  });

  return latexs.includes(ans);
};
export const sinSecondDegreeDerivative: Exercise<Identifiers> = {
  id: "sinSecondDegreeDerivative",
  label: "Calculer la dérivée seconde de sin(u)",
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
