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
type Identifiers = {
  a: number;
  b: number;
  isStrict: boolean;
};

const getAbsoluteValueInequationsQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const poly = new Polynomial([randint(-9, 10, [0]), 1]);
  const a = randint(1, 10);
  //|x-b| <= a
  const b = -poly.coefficients[0];
  const isStrict = coinFlip();
  const diff = new NumberNode(b - a);
  const add = new NumberNode(b + a);
  const answer = new InequationSolutionNode(
    new IntervalNode(diff, add, isStrict ? ClosureType.OO : ClosureType.FF),
  ).toTex();

  const question: Question<Identifiers> = {
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
      "varnothing",
      "x",
      "leq",
      "geq",
      "sup",
      "inf",
    ],
    answerFormat: "tex",
    identifiers: { a, b, isStrict },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a, b }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const diff = new NumberNode(b - a);
  const add = new NumberNode(b + a);
  tryToAddWrongProp(
    propositions,
    new InequationSolutionNode(
      new IntervalNode(diff, add, ClosureType.OO),
    ).toTex(),
  );
  tryToAddWrongProp(
    propositions,
    new InequationSolutionNode(
      new IntervalNode(diff, add, ClosureType.FF),
    ).toTex(),
  );
  tryToAddWrongProp(propositions, `S=\\left\\{${b - a};${b + a}\\right\\}`);
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      new InequationSolutionNode(
        new IntervalNode(
          new NumberNode(randint(-9, 0)),
          new NumberNode(randint(0, 10)),
          ClosureType.FF,
        ),
      ).toTex(),
    );
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, b, isStrict }) => {
  const answer = new InequationSolutionNode(
    new IntervalNode(
      new NumberNode(b - a),
      new NumberNode(b + a),
      isStrict ? ClosureType.OO : ClosureType.FF,
    ),
  );
  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};

export const absoluteValueInequations: MathExercise<Identifiers> = {
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
