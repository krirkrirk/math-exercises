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
import { Complex, ComplexConstructor } from "#root/math/complex/complex";
import { SquareRoot } from "#root/math/numbers/reals/real";
import { randint } from "#root/math/utils/random/randint";
import { SqrtNode } from "#root/tree/nodes/functions/sqrtNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";

type Identifiers = {
  re: number;
  im: number;
};

const getModuloFromAlgebraicComplexQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const z = ComplexConstructor.random();
  const zTex = z.toTree().toTex();
  const answer = z.toModuleTree().toTex();
  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Soit $z=${zTex}$. Déterminer le module $|z|$ de $z$.`,
    keys: [],
    answerFormat: "tex",
    identifiers: { re: z.re, im: z.im },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, re, im }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(
    propositions,
    new SquareRoot(re + im).simplify().toTree().toTex(),
  );
  tryToAddWrongProp(propositions, re ** 2 + im ** 2 + "");

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, `\\sqrt{${randint(0, 100)}}`);
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { re, im }) => {
  const z = new Complex(re, im);
  const answer = new SqrtNode(new NumberNode(z.moduleSquared()), {
    allowSimplifySqrt: true,
  });
  const texs = answer.toAllValidTexs();
  console.log(texs);
  return texs.includes(ans);
};

export const moduloFromAlgebraicComplex: MathExercise<Identifiers> = {
  id: "moduloFromAlgebraicComplex",
  connector: "=",
  label: "Déterminer le module d'un nombre complexe via sa forme algébrique",
  levels: ["MathExp"],
  isSingleStep: true,
  sections: ["Nombres complexes"],
  generator: (nb: number) =>
    getDistinctQuestions(getModuloFromAlgebraicComplexQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
