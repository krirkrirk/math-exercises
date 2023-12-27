import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { inequationKeys } from "#root/exercises/utils/keys/inequationKeys";
import { Rational } from "#root/math/numbers/rationals/rational";
import { Affine, AffineConstructor } from "#root/math/polynomials/affine";
import { randint } from "#root/math/utils/random/randint";
import {
  InegalitySymbols,
  InequationNode,
  getInversedInequationSymbol,
} from "#root/tree/nodes/inequations/inequationNode";
import { InequationSolutionNode } from "#root/tree/nodes/inequations/inequationSolutionNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { coinFlip } from "#root/utils/coinFlip";
import { random } from "#root/utils/random";
import { shuffle } from "#root/utils/shuffle";
import { v4 } from "uuid";
type Identifiers = {
  answer: string;
  a: number;
  b: number;
  ineqType: string;
  result: string;
};

const getFirstDegreeInequationsQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const affine = new Affine(randint(-10, 10, [0, 1]), 0);
  const b = randint(-10, 11);

  const result = new Rational(b, affine.a).simplify().toTree().toTex();

  const ineqType = random(["\\le", "<", "\\ge", ">"]);
  const invIneqType =
    ineqType === "<"
      ? ">"
      : ineqType === ">"
      ? "<"
      : ineqType === "\\le"
      ? "\\ge"
      : "\\le";
  const answer = `x${affine.a > 0 ? ineqType : invIneqType}${result}`;

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Résoudre l'inéquation : $${affine.toTex()} ${ineqType} ${b}$ `,
    keys: inequationKeys,
    answerFormat: "tex",
    identifiers: { answer, a: affine.a, b, ineqType, result },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, a, ineqType, result },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const invIneqType =
    ineqType === "<"
      ? ">"
      : ineqType === ">"
      ? "<"
      : ineqType === "\\le"
      ? "\\ge"
      : "\\le";

  tryToAddWrongProp(
    propositions,
    `x${a < 0 ? ineqType : invIneqType}${result}`,
  );
  while (propositions.length < n) {
    const wrongAnswer = `x${coinFlip() ? ineqType : invIneqType}${randint(
      -10,
      11,
    )}`;
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, b, ineqType }) => {
  const trueIneqType =
    a < 0
      ? getInversedInequationSymbol(ineqType as InegalitySymbols)
      : ineqType;
  const result = new Rational(b, a).simplify().toTree();
  const ineq = new InequationNode(
    [new VariableNode("x"), result],
    trueIneqType as InegalitySymbols,
  );
  const answer = new InequationSolutionNode(ineq.toInterval(), {
    opts: { allowFractionToDecimal: true },
  });
  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};

export const firstDegreeInequationsType1: MathExercise<Identifiers> = {
  id: "firstDegreeInequationsType1",
  connector: "\\iff",
  getPropositions,

  label: "Résoudre une inéquation du type $ax<b$",
  levels: ["3ème", "2ndPro", "2nde", "1reESM", "1rePro", "1reTech"],
  isSingleStep: true,
  sections: ["Inéquations"],
  generator: (nb: number) =>
    getDistinctQuestions(getFirstDegreeInequationsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  isAnswerValid,
};
