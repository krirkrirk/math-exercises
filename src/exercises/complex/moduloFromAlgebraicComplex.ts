import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { ComplexConstructor } from "#root/math/complex/complex";
import { SquareRoot } from "#root/math/numbers/reals/real";
import { randint } from "#root/math/utils/random/randint";

type QCMProps = {
  answer: string;
  re: number;
  im: number;
};
type VEAProps = {};

const getModuloFromAlgebraicComplexQuestion: QuestionGenerator<
  QCMProps,
  VEAProps
> = () => {
  const z = ComplexConstructor.random();
  const zTex = z.toTree().toTex();
  const answer = z.toModuleTree().toTex();
  const question: Question<QCMProps, VEAProps> = {
    answer: answer,
    instruction: `Soit $z=${zTex}$. Déterminer le module $|z|$ de $z$.`,
    keys: [],
    answerFormat: "tex",
    qcmGeneratorProps: { answer, re: z.re, im: z.im },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, re, im }) => {
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
export const moduloFromAlgebraicComplex: MathExercise<QCMProps, VEAProps> = {
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
};
