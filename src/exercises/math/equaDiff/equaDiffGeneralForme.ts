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
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { shuffle } from "#root/utils/shuffle";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";

type Identifiers = {
  a: number;
};

const getExponentialEquation: QuestionGenerator<Identifiers> = () => {
  const a = randint(-19, 20, [0]);

  const equation = new MultiplyNode(new NumberNode(a), new VariableNode("y"));

  const answer = new EqualNode(
    new VariableNode("y"),
    new MultiplyNode(
      new VariableNode("C"),
      new ExpNode(new MultiplyNode(new NumberNode(a), new VariableNode("x"))),
    ),
  ).toTex();

  const correctionequation = new EqualNode(
    new SubstractNode(
      new VariableNode("y'"),
      new MultiplyNode(a.toTree(), new VariableNode("y")),
    ).simplify(),
    new NumberNode(0),
  ).toTex();
  const hint =
    "Rappelez-vous que la solution générale d'une équation différentielle de la forme $y' = ay$ est de la forme $y = Ce^{ax}$, où $C$ est une constante d'intégration.";

  const correction = `La solution est $y = Ce^{ax}$, où $C$ est une constante d'intégration.
  \n Donc, la solution générale de l'équation différentielle $y' = ${a}y$ est $y = Ce^{${a}x}$.`;

  const question: Question<Identifiers> = {
    instruction: `Résoudre l'équation différentielle suivante : $y' = ${equation.toTex()}$.`,
    startStatement: `y(x)`,
    answer,
    hint,
    correction,
    keys: ["x", "y", "epower", "exp", "C", "equal"],
    answerFormat: "tex",
    identifiers: { a },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const yNode = new VariableNode("y");
  const cNode = new VariableNode("C");
  const xNode = new VariableNode("x");
  while (propositions.length < n) {
    const a = randint(1, 10);
    const myWrongAnswer = new EqualNode(
      yNode,
      new MultiplyNode(
        cNode,
        new ExpNode(new MultiplyNode(new NumberNode(a), xNode)),
      ),
    );
    tryToAddWrongProp(propositions, myWrongAnswer.toTex());
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a }) => {
  const answer = new EqualNode(
    new VariableNode("y"),
    new MultiplyNode(
      new VariableNode("C"),
      new ExpNode(new MultiplyNode(new NumberNode(a), new VariableNode("x"))),
    ),
    { allowRawRightChildAsSolution: true },
  );
  const texs = answer.toAllValidTexs();
  console.log(texs);
  return texs.includes(ans);
};

export const exponentialDifferentialEquation: Exercise<Identifiers> = {
  id: "exponentialDifferentialEquation",
  connector: "=",
  label: "Équation différentielle $y' = ay$",
  levels: ["1reSpé", "MathComp", "TermSpé"],
  sections: ["Équations différentielles"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getExponentialEquation, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
