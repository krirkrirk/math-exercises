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
import { Trinom, TrinomConstructor } from "#root/math/polynomials/trinom";
import { randint } from "#root/math/utils/random/randint";
import { EquationSolutionNode } from "#root/tree/nodes/equations/equationSolutionNode";
import { OppositeNode } from "#root/tree/nodes/functions/oppositeNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { DiscreteSetNode } from "#root/tree/nodes/sets/discreteSetNode";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  a: number;
  b: number;
  c: number;
};

const getRootsFromFactorizedFormQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const trinom = TrinomConstructor.randomFactorized();
  const answer = trinom.getRootsEquationSolutionTex();
  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Soit $f(x) = ${trinom
      .getFactorizedForm()
      .toTex()}$. Résoudre l'équation $f(x) = 0$.`,
    keys: ["S", "equal", "lbrace", "semicolon", "rbrace", "varnothing"],
    answerFormat: "tex",
    identifiers: { a: trinom.a, b: trinom.b, c: trinom.c },
  };

  return question;
};
const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a, b, c }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const trinom = new Trinom(a, b, c);
  const roots = trinom.getRoots();
  if (roots.length === 1 && roots[0] !== 0) {
    tryToAddWrongProp(
      propositions,
      `S=\\left\\{${new OppositeNode(
        new NumberNode(roots[0]),
      ).toTex()}\\right\\}`,
    );
  }
  if (roots.length === 2 && roots[0] !== 0) {
    tryToAddWrongProp(
      propositions,
      `S=\\left\\{${new OppositeNode(new NumberNode(roots[0])).toTex()};${
        roots[1]
      }\\right\\}`,
    );
  }
  if (roots.length === 2 && roots[1] !== 0) {
    tryToAddWrongProp(
      propositions,
      `S=\\left\\{${roots[0]};${new OppositeNode(
        new NumberNode(roots[1]),
      ).toTex()}\\right\\}`,
    );
  }
  if (roots.length === 2 && roots[0] !== 0 && roots[1] !== 0) {
    tryToAddWrongProp(
      propositions,
      `S=\\left\\{${new OppositeNode(
        new NumberNode(roots[0]),
      ).toTex()};${new OppositeNode(
        new NumberNode(roots[1]),
      ).toTex()}\\right\\}`,
    );
  }

  while (propositions.length < n) {
    const wrongAnswer = `S=\\left\\{${randint(-10, 11)};${randint(
      -10,
      11,
    )}\\right\\}`;
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, b, c }) => {
  const trinom = new Trinom(a, b, c);
  const roots = trinom.getRootsNode();
  const answer = new EquationSolutionNode(new DiscreteSetNode(roots));
  const texs = answer.toAllValidTexs();

  return texs.includes(ans);
};

export const rootsFromFactorizedForm: Exercise<Identifiers> = {
  id: "rootsFromFactorizedForm",
  connector: "=",
  label: "Déterminer les racines d'un trinôme à partir de sa forme factorisée",
  levels: ["1reSpé", "TermSpé", "MathComp"],
  isSingleStep: true,
  sections: ["Second degré"],
  generator: (nb: number) =>
    getDistinctQuestions(getRootsFromFactorizedFormQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
