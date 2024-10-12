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
import { SquareRootConstructor } from "#root/math/numbers/reals/real";
import { randint } from "#root/math/utils/random/randint";
import { SqrtNode } from "#root/tree/nodes/functions/sqrtNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { coinFlip } from "#root/utils/alea/coinFlip";

type Identifiers = {
  a: number;
  b: number;
  c: number;
  d: number | undefined;
  x: number;
  y: number;
  z: number | undefined;
};

//a sqrt(x*b) + c sqrt(y*b) (+ d sqrt(z*b))
//avec x,y,z carrés parfait
const getSquareRootsSumQuestion: QuestionGenerator<Identifiers> = () => {
  const a = randint(-9, 10, [0]);
  const aNode = new NumberNode(a);
  const c = randint(-9, 10, [0]);
  const cNode = new NumberNode(c);
  const b = SquareRootConstructor.randomIrreductible(10).operand;
  let x = randint(1, 6);
  x *= x;
  const xbNode = new NumberNode(b * x);
  let y = randint(1, 6);
  y *= y;
  const ybNode = new NumberNode(b * y);
  let d: number | undefined;
  let z: number | undefined;
  if (coinFlip()) {
    d = randint(-9, 10, [0]);
    z = randint(1, 6);
    z *= z;
  }
  let statement = new AddNode(
    new MultiplyNode(aNode, new SqrtNode(xbNode)),
    new MultiplyNode(cNode, new SqrtNode(ybNode)),
  );
  if (!!d && !!z) {
    const dNode = new NumberNode(d);
    const zbNode = new NumberNode(z * b);
    statement = new AddNode(
      statement,
      new MultiplyNode(dNode, new SqrtNode(zbNode)),
    );
  }
  const answer = statement.simplify().toTex();
  const question: Question<Identifiers> = {
    answer,
    instruction: `Simplifier sous la forme $a\\sqrt{b}$ avec $b$ le plus petit possible : $${statement.toTex()}$`,
    keys: [],
    answerFormat: "tex",
    identifiers: { a, b, c, d, x, y, z },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, b }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      new MultiplyNode(
        new NumberNode(randint(-50, 51, [0])),
        new SqrtNode(new NumberNode(b)),
      ).toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, a, b, c, d, y, x, z },
) => {
  let coeff = a * Math.sqrt(x) + c * Math.sqrt(y);
  if (!!d && !!z) {
    coeff += d * Math.sqrt(z);
  }
  const tree = new MultiplyNode(
    new NumberNode(coeff),
    new SqrtNode(new NumberNode(b)),
  ).simplify();
  const texs = tree.toAllValidTexs();
  return texs.includes(ans);
};

export const squareRootsSum: Exercise<Identifiers> = {
  id: "squareRootsSum",
  connector: "=",
  label: "Simplifier une somme de racines carrées",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Racines carrées"],
  generator: (nb: number) =>
    getDistinctQuestions(getSquareRootsSumQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
