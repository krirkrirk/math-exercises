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
import { Integer } from "#root/math/numbers/integer/integer";
import { RationalConstructor } from "#root/math/numbers/rationals/rational";
import { RemarkableValueConstructor } from "#root/math/trigonometry/remarkableValue";
import { remarkableTrigoValues } from "#root/math/trigonometry/remarkableValues";
import { randint } from "#root/math/utils/random/randint";
import { ComplexNode } from "#root/tree/nodes/complex/complexNode";
import { SqrtNode } from "#root/tree/nodes/functions/sqrtNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { random } from "#root/utils/random";

type Identifiers = {
  arg: number;
  zTex: string;
};

const getArgumentFromAlgebraicComplexQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const arg = RemarkableValueConstructor.mainInterval();
  const factor = random([
    new Integer(randint(-5, 6, [0, 1])).toTree(),
    RationalConstructor.randomIrreductible().toTree(),
    random([new SqrtNode(new NumberNode(2)), new SqrtNode(new NumberNode(3))]),
  ]);
  const re = new MultiplyNode(factor, arg.cos).simplify();
  const im = new MultiplyNode(factor, arg.sin).simplify();
  const z = new ComplexNode(re, im);
  const zTex = z.toTex();
  const answer = arg.angle.toTex();
  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Soit $z=${zTex}$. Déterminer l'argument principal de $z$.`,
    keys: ["pi"],
    answerFormat: "tex",
    identifiers: { arg: arg.angle.evaluate({}), zTex },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    const randomPoint = RemarkableValueConstructor.mainInterval();
    tryToAddWrongProp(propositions, randomPoint.angle.toTex());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { arg }) => {
  const point = remarkableTrigoValues.find(
    (point) => point.angle.evaluate({}) === arg,
  );
  const texs = point!.angle.toAllValidTexs();
  return texs.includes(ans);
};
export const argumentFromAlgebraicComplex: MathExercise<Identifiers> = {
  id: "argumentFromAlgebraicComplex",
  connector: "=",
  label: "Déterminer l'argument d'un nombre complexe via sa forme algébrique",
  levels: ["MathExp"],
  isSingleStep: true,
  sections: ["Nombres complexes"],
  generator: (nb: number) =>
    getDistinctQuestions(getArgumentFromAlgebraicComplexQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
