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
  abscisse: number;
  trinome: number[];
};

const getTangentEquationQuestion: QuestionGenerator<Identifiers> = () => {
  const trinome = TrinomConstructor.random();
  const abscisse = randint(-10, 10);
  const image = trinome.calculate(abscisse);
  const derivee = trinome.derivate();
  const imagederivee = derivee.calculate(abscisse);
  const k = abscisse * imagederivee;
  const constante = k - image;
  const equation = new EqualNode(
    new VariableNode("y"),
    new SubstractNode(
      new MultiplyNode(imagederivee.toTree(), new VariableNode("x")),
      constante.toTree(),
    ).simplify(),
  );
  const ans = equation.toTex();

  const question: Question<Identifiers> = {
    answer: ans,
    instruction: `Soit $f(x) = ${trinome
      .toTree()
      .toTex()}$. Déterminer l'équation de la tangente à la courbe de $f$ au point d'abscisse $${abscisse}$.`,
    keys: ["y", "x", "equal"],
    answerFormat: "tex",
    identifiers: { abscisse, trinome: [trinome.a, trinome.b, trinome.c] },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    const randomfactor1 = randint(-99, 99);
    const randomfactor2 = randint(-99, 99);
    const randomequation = new EqualNode(
      new VariableNode("y"),
      new SubstractNode(
        new MultiplyNode(randomfactor1.toTree(), new VariableNode("x")),
        randomfactor2.toTree(),
      ).simplify(),
    );
    const wrongAnswer = randomequation.toTex();
    tryToAddWrongProp(propositions, wrongAnswer);
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, abscisse, trinome },
) => {
  const trinome1 = new Trinom(trinome[0], trinome[1], trinome[2]);
  const image1 = trinome1.calculate(abscisse);
  const derivee1 = trinome1.derivate();
  const imagederivee1 = derivee1.calculate(abscisse);
  const k = abscisse * imagederivee1;
  const constante = k - image1;
  const equation1 = new EqualNode(
    new VariableNode("y"),
    new SubstractNode(
      new MultiplyNode(imagederivee1.toTree(), new VariableNode("x")),
      constante.toTree(),
    ).simplify(),
  );
  const latexs = equation1.toAllValidTexs({
    allowRawRightChildAsSolution: true,
  });
  return latexs.includes(ans);
};
export const tangentEquations: Exercise<Identifiers> = {
  id: "tangentEquations",
  label: "Déterminer l'équation d'une tangente",
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
