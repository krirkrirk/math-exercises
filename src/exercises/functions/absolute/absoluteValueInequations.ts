import {
  shuffleProps,
  MathExercise,
  Proposition,
  Question,
  tryToAddWrongProp,
  QuestionGenerator,
  QCMGenerator,
  addValidProp,
  VEA,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Polynomial } from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import { InequationSolutionNode } from "#root/tree/nodes/inequations/inequationSolutionNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { ClosureType, IntervalNode } from "#root/tree/nodes/sets/intervalNode";
import { coinFlip } from "#root/utils/coinFlip";
import { v4 } from "uuid";
type QCMProps = {
  answer: string;
  a: number;
  b: number;
  isStrict: boolean;
};
type VEAProps = {
  a: number;
  b: number;
  isStrict: boolean;
};

const getAbsoluteValueInequationsQuestion: QuestionGenerator<
  QCMProps,
  VEAProps
> = () => {
  const poly = new Polynomial([randint(-9, 10, [0]), 1]);
  const a = randint(1, 10);
  //|x-b| <= a
  const b = -poly.coefficients[0];
  const isStrict = coinFlip();
  const answer = isStrict ? `S=]${b - a};${b + a}[` : `S=[${b - a};${b + a}]`;

  const question: Question<QCMProps, VEAProps> = {
    answer,
    instruction: `Résoudre l'inéquation $|${poly.toTree().toTex()}|${
      isStrict ? "<" : "\\le"
    }${a}$.`,
    keys: [
      "S",
      "equal",
      "lbracket",
      "semicolon",
      "rbracket",
      "emptyset",
      "x",
      "leq",
      "geq",
      "sup",
      "inf",
    ],
    answerFormat: "tex",
    qcmGeneratorProps: { answer, a, b, isStrict },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, a, b }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, `S=]${b - a};${b + a}[`);
  tryToAddWrongProp(propositions, `S=[${b - a};${b + a}]`);
  tryToAddWrongProp(propositions, `S=\\left\\{${b - a};${b + a}\\right\\}`);
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, `S=[${randint(-9, 0)};${randint(0, 10)}]`);
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<VEAProps> = (ans, { a, b, isStrict }) => {
  const answer = new InequationSolutionNode(
    new IntervalNode(
      new NumberNode(b - a),
      new NumberNode(b + a),
      isStrict ? ClosureType.OO : ClosureType.FF,
    ),
  );
  const texs = answer.toAllValidTexs();
  console.log(texs);
  return texs.includes(ans);
};

export const absoluteValueInequations: MathExercise<QCMProps, VEAProps> = {
  id: "absoluteValueInequations",
  connector: "\\iff",
  label: "Résoudre une inéquation avec valeur absolue",
  levels: ["2nde", "1reESM"],
  isSingleStep: true,
  sections: ["Valeur absolue", "Inéquations", "Ensembles et intervalles"],
  generator: (nb: number) =>
    getDistinctQuestions(getAbsoluteValueInequationsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
