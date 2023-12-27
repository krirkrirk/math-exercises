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
import { Affine } from "#root/math/polynomials/affine";
import { randint } from "#root/math/utils/random/randint";
import {
  InegalitySymbols,
  InequationNode,
  getInversedInequationSymbol,
} from "#root/tree/nodes/inequations/inequationNode";
import { InequationSolutionNode } from "#root/tree/nodes/inequations/inequationSolutionNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { coinFlip } from "#root/utils/coinFlip";
import { random } from "#root/utils/random";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  coeff: number;
  ineqType: string;
  result: string;
  a: number;
  b: number;
  c: number;
  d: number;
};

const getFirstDegreeInequationsQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const affine1 = new Affine(randint(-10, 10, [0]), randint(-10, 10));
  const affine2 = new Affine(
    randint(-10, 10, [0, affine1.a]),
    randint(-10, 10),
  );

  const result = new Rational(affine2.b - affine1.b, affine1.a - affine2.a)
    .simplify()
    .toTree()
    .toTex();
  const coeff = affine1.a - affine2.a;
  const ineqType = random(["\\le", "<", "\\ge", ">"]);
  const invIneqType =
    ineqType === "<"
      ? ">"
      : ineqType === ">"
      ? "<"
      : ineqType === "\\le"
      ? "\\ge"
      : "\\le";
  const answer = `x${coeff > 0 ? ineqType : invIneqType}${result}`;

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Résoudre l'inéquation : $${affine1.toTex()} ${ineqType} ${affine2.toTex()}$ `,
    keys: inequationKeys,
    answerFormat: "tex",
    identifiers: {
      coeff,
      ineqType,
      result,
      a: affine1.a,
      b: affine1.b,
      c: affine2.a,
      d: affine2.b,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, coeff, ineqType, result },
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
    `x${coeff < 0 ? ineqType : invIneqType}${result}`,
  );

  while (propositions.length < n) {
    const wrongAnswer = `x ${coinFlip() ? ineqType : invIneqType} ${randint(
      -10,
      11,
    )}`;

    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, b, c, d, ineqType }) => {
  const trueIneqType =
    a - c < 0
      ? getInversedInequationSymbol(ineqType as InegalitySymbols)
      : ineqType;
  const result = new Rational(d - b, a - c).simplify().toTree();
  const ineq = new InequationNode(
    [new VariableNode("x"), result],
    trueIneqType as InegalitySymbols,
  );
  const answer = new InequationSolutionNode(ineq.toInterval(), {
    opts: { allowFractionToDecimal: true },
  });
  const texs = answer.toAllValidTexs();
  console.log(texs);
  return texs.includes(ans);
};

export const firstDegreeInequationsType3: MathExercise<Identifiers> = {
  id: "firstDegreeInequationsType3",
  connector: "\\iff",
  label: "Résoudre une inéquation du type $ax+b<cx+d$",
  levels: ["3ème", "2ndPro", "2nde", "1reESM", "1rePro", "1reTech"],
  isSingleStep: true,
  sections: ["Inéquations"],
  generator: (nb: number) =>
    getDistinctQuestions(getFirstDegreeInequationsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
