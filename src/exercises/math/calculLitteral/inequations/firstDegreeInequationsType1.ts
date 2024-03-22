import {
  Exercise,
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
import {
  InegalitySymbols,
  InequationSymbol,
  InequationSymbolConstructor,
} from "#root/math/inequations/inequation";
import { Rational } from "#root/math/numbers/rationals/rational";
import { Affine } from "#root/math/polynomials/affine";
import { randint } from "#root/math/utils/random/randint";
import { InequationNode } from "#root/tree/nodes/inequations/inequationNode";
import { InequationSolutionNode } from "#root/tree/nodes/inequations/inequationSolutionNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { coinFlip } from "#root/utils/coinFlip";
import { shuffle } from "#root/utils/shuffle";
type Identifiers = {
  a: number;
  b: number;
  ineqType: InegalitySymbols;
};
/**ax<b */
const getFirstDegreeInequationsQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const affine = new Affine(randint(-10, 10, [0, 1]), 0);
  const b = randint(-10, 11);

  const result = new Rational(b, affine.a).simplify().toTree().toTex();

  const ineqType = InequationSymbolConstructor.random();
  const invIneqType = ineqType.reversed();
  const answer = `x${affine.a > 0 ? ineqType.symbol : invIneqType}${result}`;

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Résoudre l'inéquation : $${affine.toTex()} ${
      ineqType.symbol
    } ${b}$ `,
    keys: inequationKeys,
    answerFormat: "tex",
    identifiers: { a: affine.a, b, ineqType: ineqType.symbol },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, a, ineqType, b },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const ineq = new InequationSymbol(ineqType);
  const invIneqType = ineq.reversed();
  const result = new Rational(b, a).simplify().toTree().toTex();

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
  const ineqSymbol = new InequationSymbol(ineqType);
  const invIneqType = ineqSymbol.reversed();
  const trueIneqType = a < 0 ? invIneqType : ineqType;
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

export const firstDegreeInequationsType1: Exercise<Identifiers> = {
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
  subject: "Mathématiques",
};
