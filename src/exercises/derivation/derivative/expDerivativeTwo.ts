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
import { randint } from "#root/math/utils/random/randint";
import { ExpNode } from "#root/tree/nodes/functions/expNode"; // Importer le nœud d'exponentielle
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";

type Identifiers = {
  a: number;
  b: number;
};

const getExpDerivative: QuestionGenerator<Identifiers> = () => {
  const a = randint(-9, 10, [0]);
  const b = randint(-9, 10);

  const myfunction = new AddNode(
    new MultiplyNode(new NumberNode(a), new ExpNode(new VariableNode("x"))),
    new NumberNode(b),
  );
  const derivative = new MultiplyNode(
    new NumberNode(a),
    new ExpNode(new VariableNode("x")),
  );
  const answer = derivative.toTex();
  const question: Question<Identifiers> = {
    instruction: `Déterminer la dérivée de la fonction $f(x) = ${myfunction.toTex()}$.`,
    startStatement: "f'(x)",
    answer,
    keys: ["x", "epower", "exp"],
    answerFormat: "tex",
    identifiers: { a, b },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a, b }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const myfunction = new AddNode(
    new MultiplyNode(new NumberNode(a), new ExpNode(new VariableNode("x"))),
    new NumberNode(b),
  );
  tryToAddWrongProp(propositions, myfunction.toTex());
  tryToAddWrongProp(propositions, a + "");
  while (propositions.length < n) {
    const randomA = randint(-9, 10, [0]);
    tryToAddWrongProp(
      propositions,
      new MultiplyNode(
        new NumberNode(randomA),
        new ExpNode(new VariableNode("x")),
      ).toTex(),
    );
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a }) => {
  const derivative = new MultiplyNode(
    new NumberNode(a),
    new ExpNode(new VariableNode("x")),
  );
  const texs = derivative.toAllValidTexs();
  return texs.includes(ans);
};

export const expDerivativeTwo: MathExercise<Identifiers> = {
  id: "expDerivativeTwo",
  connector: "=",
  label: "Dérivée de $a \\times \\exp(x) + b$",
  levels: ["1reESM", "1reSpé", "1reTech", "MathComp"],
  sections: ["Dérivation", "Exponentielle"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getExpDerivative, nb),
  getPropositions,
  qcmTimer: 60,
  freeTimer: 60,
  isAnswerValid,
};
