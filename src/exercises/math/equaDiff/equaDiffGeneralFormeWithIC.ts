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
import { randint } from "#root/math/utils/random/randint";
import { ExpNode } from "#root/tree/nodes/functions/expNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { shuffle } from "#root/utils/alea/shuffle";

type Identifiers = {
  a: number;
  initialY: number;
};

const solveExponentialEquationWithIC: QuestionGenerator<Identifiers> = () => {
  const a = randint(-9, 10, [0]);
  const initialY = randint(-9, 10);

  const myEquation = new MultiplyNode(new NumberNode(a), new VariableNode("y"));

  const solution =
    initialY === 0
      ? new NumberNode(0) // y(0) = 0 ==> y(x) = 0
      : new MultiplyNode(
          new NumberNode(initialY),
          new ExpNode(
            new MultiplyNode(new NumberNode(a), new VariableNode("x")),
          ),
        );

  const answer = new EqualNode(new VariableNode("y"), solution).toTex();
  const question: Question<Identifiers> = {
    instruction: `Résoudre l'équation différentielle suivante : $y' = ${myEquation.toTex()} \\ $ et $\\ y(0) = ${initialY}$`,
    startStatement: `y(x)`,
    answer,
    keys: ["x", "y", "epower", "exp", "equal"],
    answerFormat: "tex",
    identifiers: { a, initialY },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const a = randint(-9, 10, [0]);
    const initialY = randint(-9, 10);
    const solution =
      initialY === 0
        ? new NumberNode(0) // y(0) = 0 ==> y(x) = 0
        : new MultiplyNode(
            new NumberNode(initialY),
            new ExpNode(
              new MultiplyNode(new NumberNode(a), new VariableNode("x")),
            ),
          );
    const wrongAnswer = new EqualNode(new VariableNode("y"), solution);
    tryToAddWrongProp(propositions, wrongAnswer.toTex());
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, initialY }) => {
  const solution =
    initialY === 0
      ? new NumberNode(0) // y(0) = 0 ==> y(x) = 0
      : new MultiplyNode(
          new NumberNode(initialY),
          new ExpNode(
            new MultiplyNode(new NumberNode(a), new VariableNode("x")),
          ),
        );

  const answer = new EqualNode(new VariableNode("y"), solution, {
    allowRawRightChildAsSolution: true,
  });
  const texs = answer.toAllValidTexs();

  return texs.includes(ans);
};

export const exponentialDifferentialEquationWithIC: Exercise<Identifiers> = {
  id: "exponentialDifferentialEquationWithIC",
  connector: "=",
  label: "Équation différentielle $y' = ay$ avec conditions initiales",
  levels: ["1reSpé", "MathComp", "TermSpé"],
  sections: ["Équations différentielles"],
  isSingleStep: false,
  generator: (nb: number) =>
    getDistinctQuestions(solveExponentialEquationWithIC, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
