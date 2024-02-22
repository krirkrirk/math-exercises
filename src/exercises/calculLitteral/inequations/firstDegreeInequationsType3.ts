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
import { random } from "#root/utils/random";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  coeff: number;
  ineqType: InegalitySymbols;
  a: number;
  b: number;
  c: number;
  d: number;
};

/**ax+b<cx+d */
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
  const ineqType = InequationSymbolConstructor.random();
  const invIneqType = ineqType.reversed();
  const answer = `x${coeff > 0 ? ineqType.symbol : invIneqType}${result}`;

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Résoudre l'inéquation : $${affine1.toTex()} ${
      ineqType.symbol
    } ${affine2.toTex()}$ `,
    keys: inequationKeys,
    answerFormat: "tex",
    identifiers: {
      coeff,
      ineqType: ineqType.symbol,
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
  { answer, coeff, ineqType, a, b, c, d },
) => {
  const result = new Rational(d - b, a - c).simplify().toTree().toTex();
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const ineq = new InequationSymbol(ineqType);
  const invIneqType = ineq.reversed();
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
  const ineqSymbol = new InequationSymbol(ineqType);
  const invIneqType = ineqSymbol.reversed();
  const trueIneqType = a - c < 0 ? invIneqType : ineqType;
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
