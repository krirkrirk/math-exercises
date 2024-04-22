import {
  Exercise,
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
import { PolynomialConstructor } from "#root/math/polynomials/polynomial";
import { Trinom, TrinomConstructor } from "#root/math/polynomials/trinom";
import { randint } from "#root/math/utils/random/randint";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { equal } from "assert";
import { reduceExpression } from "../../calculLitteral";

type Identifiers = {
  a: number;
  f: number[];
};

const getTangentEquationQuestion: QuestionGenerator<Identifiers> = () => {
  const f = TrinomConstructor.random();
  const a = randint(-10, 10);
  const b = f.calculate(a);
  const df = f.derivate();
  const c = df.calculate(a);
  const ca = a * c;
  const d = ca - b;
  const eq = new EqualNode(
    new VariableNode("y"),
    new SubstractNode(
      new MultiplyNode(c.toTree(), new VariableNode("x")),
      d.toTree(),
    ).simplify(),
  );
  const ans = eq.toTex();

  const question: Question<Identifiers> = {
    answer: ans,
    instruction: `Soit $f(x) = ${f
      .toTree()
      .toTex()}$, $a = ${a}$. Déterminer l'équation de la tangente à la courbe de $f$ au point d'abscisse $a$`,
    keys: ["y", "x", "equal"],
    answerFormat: "tex",
    identifiers: { a: a, f: [f.a, f.b, f.c] },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    const a = randint(-99, 99);
    const b = randint(-99, 99);
    const ww = new EqualNode(
      new VariableNode("y"),
      new SubstractNode(
        new MultiplyNode(a.toTree(), new VariableNode("x")),
        b.toTree(),
      ).simplify(),
    );
    const wrongAnswer = ww.toTex();
    tryToAddWrongProp(propositions, wrongAnswer);
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, a, f }) => {
  const ff = new Trinom(f[0], f[1], f[2]);
  const b = ff.calculate(a);
  const df = ff.derivate();
  const c = df.calculate(a);
  const ca = a * c;
  const d = ca - b;
  const eq = new EqualNode(
    new VariableNode("y"),
    new SubstractNode(
      new MultiplyNode(c.toTree(), new VariableNode("x")),
      d.toTree(),
    ).simplify(),
  );
  const latexs = eq.toAllValidTexs({ allowRawRightChildAsSolution: true });
  return latexs.includes(ans);
};
export const tangentEquations: Exercise<Identifiers> = {
  id: "tangentEquations",
  label: "Calcul de l'équation de la tangente",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Dérivation"],
  generator: (nb: number) =>
    getDistinctQuestions(getTangentEquationQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
