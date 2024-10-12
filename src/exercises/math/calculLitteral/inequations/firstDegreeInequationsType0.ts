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
import { Affine } from "#root/math/polynomials/affine";
import { randint } from "#root/math/utils/random/randint";
import { InequationNode } from "#root/tree/nodes/inequations/inequationNode";
import { InequationSolutionNode } from "#root/tree/nodes/inequations/inequationSolutionNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { random } from "#root/utils/alea/random";
import { shuffle } from "#root/utils/alea/shuffle";

type Identifiers = {
  b: number;
  c: number;
  ineqType: InegalitySymbols;
};

/**x +b < c */
const getFirstDegreeInequationsQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const affine = new Affine(1, randint(-10, 11, [0]));
  const c = randint(-10, 11);

  const result = c - affine.b;

  const ineqType = InequationSymbolConstructor.random();
  const answer = `x${ineqType.symbol}${result}`;

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Résoudre l'inéquation : $${affine.toTex()} ${
      ineqType.symbol
    } ${c}$ `,
    keys: inequationKeys,
    answerFormat: "tex",
    identifiers: { ineqType: ineqType.symbol, b: affine.b, c },
  };

  return question;
};
const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, ineqType, b, c },
) => {
  const result = c - b;
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const ineqSymbol = new InequationSymbol(ineqType);
  const invIneqType = ineqSymbol.reversed();

  tryToAddWrongProp(propositions, `x${invIneqType}${result}`);
  while (propositions.length < n) {
    const wrongAnswer = `x${coinFlip() ? ineqType : invIneqType}${randint(
      -10,
      11,
    )}`;

    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, ineqType, b, c }) => {
  const result = c - b;
  const ineq = new InequationNode(
    [new VariableNode("x"), new NumberNode(result)],
    ineqType as InegalitySymbols,
  );
  const tree = new InequationSolutionNode(ineq.toInterval());
  const texs = tree.toAllValidTexs();
  return texs.includes(ans);
};

export const firstDegreeInequationsType0: Exercise<Identifiers> = {
  id: "firstDegreeInequationsType0",
  connector: "\\iff",
  label: "Résoudre une inéquation du type $x+b<c$",
  levels: ["3ème", "2ndPro", "2nde", "1reESM", "1rePro", "1reTech"],
  isSingleStep: true,
  sections: ["Inéquations"],
  generator: (nb: number) =>
    getDistinctQuestions(getFirstDegreeInequationsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
