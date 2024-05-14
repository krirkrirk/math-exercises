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
import { Affine } from "#root/math/polynomials/affine";
import { randint } from "#root/math/utils/random/randint";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { ExpNode } from "#root/tree/nodes/functions/expNode";
import { IntegralNode } from "#root/tree/nodes/functions/integralNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";

type Identifiers = {
  a: number;
  b: number;
  aX: number;
  bX: number;
};

const getIntegralExpAxPlusBQuestion: QuestionGenerator<Identifiers> = () => {
  const b = randint(-4, 6);
  const a = randint(-5, b);

  const aX = randint(-10, 11, [0]);
  const bX = randint(-10, 11, [0]);

  const e = new ExpNode(new Affine(aX, bX, "x").toTree());
  const f = new IntegralNode(e, a.toTree(), b.toTree(), "x");

  const correctAns = getCorrectAnswer(a, b, aX, bX);

  const question: Question<Identifiers> = {
    answer: correctAns.toTex(),
    instruction: `Calculez l'intégrale de $${f.toTex()}$`,
    keys: ["epower"],
    answerFormat: "tex",
    identifiers: { a, b, aX, bX },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, a, b, aX, bX },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  generatePropositions(a, b, aX, bX).forEach((value) =>
    tryToAddWrongProp(propositions, value),
  );
  let random;
  const oneDivAx = new FractionNode((1).toTree(), aX.toTree()).simplify();
  while (propositions.length < n) {
    const a = randint(-10, 11).toTree();
    const b = randint(-10, 11).toTree();
    random = new MultiplyNode(
      oneDivAx,
      new SubstractNode(
        new ExpNode(a).simplify(),
        new ExpNode(b).simplify(),
      ).simplify(),
    );
    tryToAddWrongProp(propositions, random.toTex());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, b, aX, bX }) => {
  const correctAns = getCorrectAnswer(a, b, aX, bX);
  return correctAns.toAllValidTexs().includes(ans);
};

const getCorrectAnswer = (
  a: number,
  b: number,
  aX: number,
  bX: number,
): AlgebraicNode => {
  const f = new Affine(aX, bX, "x").toTree();
  const oneDivAx = new FractionNode((1).toTree(), aX.toTree()).simplify();

  return new MultiplyNode(
    oneDivAx,
    new SubstractNode(
      new ExpNode(f.evaluate({ x: b }).toTree()).simplify(),
      new ExpNode(f.evaluate({ x: a }).toTree()).simplify(),
    ).simplify(),
  );
};

const generatePropositions = (
  a: number,
  b: number,
  aX: number,
  bX: number,
): string[] => {
  const f = new Affine(aX, bX, "x");
  const fTree = f.toTree();
  const aXNode = aX.toTree();
  const oneDivAx = new FractionNode((1).toTree(), aXNode).simplify();

  const fA = fTree.evaluate({ x: a }).toTree();
  const fB = fTree.evaluate({ x: b }).toTree();

  const expFA = new ExpNode(fA).simplify();
  const expFB = new ExpNode(fB).simplify();

  const firstProposition = new SubstractNode(expFB, expFA).simplify();
  const secondProposition = new MultiplyNode(
    oneDivAx,
    new AddNode(expFB, expFA).simplify(),
  );
  const thirdProposition = new SubstractNode(
    new MultiplyNode(aXNode, expFB).simplify(),
    new MultiplyNode(aXNode, expFA).simplify(),
  ).simplify();
  return [
    firstProposition.toTex(),
    secondProposition.toTex(),
    thirdProposition.toTex(),
  ];
};
export const integralExpAxPlusB: Exercise<Identifiers> = {
  id: "integralExpAxPlusB",
  label: "Calcul d'intégrale du type $exp(ax+b)$",
  levels: ["TermSpé"],
  isSingleStep: true,
  sections: ["Intégration"],
  generator: (nb: number) =>
    getDistinctQuestions(getIntegralExpAxPlusBQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
