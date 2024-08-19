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
import { Affine, AffineConstructor } from "#root/math/polynomials/affine";
import { Trinom, TrinomConstructor } from "#root/math/polynomials/trinom";
import { randint } from "#root/math/utils/random/randint";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { ExpNode } from "#root/tree/nodes/functions/expNode";
import { Node } from "#root/tree/nodes/node";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { coinFlip } from "#root/utils/coinFlip";
import { doWhile } from "#root/utils/doWhile";
import { random } from "#root/utils/random";

type Identifiers = {
  type: string;
  d: number;
  e: number;
  f: number | undefined;
};

const getEquaDiffCheckSolutionFirstOrderQuestion: QuestionGenerator<
  Identifiers
> = () => {
  //types : constante, affine, tirnom, exp
  const type = random<"affine" | "trinom" | "exp">(["affine", "trinom", "exp"]);

  const isSolution = coinFlip();

  const answer = isSolution ? "Oui" : "Non";
  let equaDiff: Node;
  let randomFunc: AlgebraicNode;
  let d: number;
  let e: number;
  let f: number | undefined;
  switch (type) {
    case "affine":
      // y = y' + dx+e, alors y = ax+b
      //ax+b = a + dx + e
      //a = d et e = b-a
      const affineSolution = AffineConstructor.random();
      d = affineSolution.a;
      e = affineSolution.b - affineSolution.a;
      const affine = new Affine(d, e);
      equaDiff = new EqualNode(
        new VariableNode("y"),
        new AddNode(new VariableNode("y'"), affine.toTree()),
      );
      randomFunc = isSolution
        ? affineSolution.toTree()
        : doWhile(
            () => AffineConstructor.random(),
            (P) => P.equals(affineSolution),
          ).toTree();
      break;
    case "trinom":
      /**y = y' + dx^2+ex+f, alors y = ax^2+bx+c */

      const trinomSolution = TrinomConstructor.random();
      d = trinomSolution.a;
      e = trinomSolution.b - 2 * trinomSolution.a;
      f = trinomSolution.c - trinomSolution.b;
      const trinom = new Trinom(d, e, f);
      equaDiff = new EqualNode(
        new VariableNode("y"),
        new AddNode(new VariableNode("y'"), trinom.toTree()),
      );
      randomFunc = isSolution
        ? trinomSolution.toTree()
        : doWhile(
            () => TrinomConstructor.random(),
            (P) => P.equals(trinomSolution),
          ).toTree();
      break;
    case "exp":
      /**y = y' +d exp(e*x), alors y = a exp(e*x) */
      //a exp(ex) = ae*exp(ex) + dexp(e*x)
      //a = ae + d
      //d/(1-e) == a
      e = randint(-4, 5, [0, 1]);
      const a = randint(-5, 5, [0]);
      d = a - a * e;
      const expSolution = new MultiplyNode(
        a.toTree(),
        new ExpNode(new MultiplyNode(e.toTree(), new VariableNode("x"))),
      );

      const exp = new MultiplyNode(
        d.toTree(),
        new ExpNode(new MultiplyNode(e.toTree(), new VariableNode("x"))),
      );
      equaDiff = new EqualNode(
        new VariableNode("y"),
        new AddNode(new VariableNode("y'"), exp),
      );
      randomFunc = isSolution
        ? expSolution
        : doWhile(
            () =>
              new MultiplyNode(
                randint(-5, 5, [0]).toTree(),
                new ExpNode(
                  new MultiplyNode(e.toTree(), new VariableNode("x")),
                ),
              ),
            (P) => P.equals(expSolution),
          );
      break;
  }

  const question: Question<Identifiers> = {
    answer,
    instruction: `Soit l'équation différentielle suivante : $${equaDiff.toTex()}$. La fonction $y = ${randomFunc.toTex()}$ est-elle solution de cette équation ?`,
    keys: [],
    answerFormat: "tex",
    identifiers: { type, d, e, f },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");
  tryToAddWrongProp(propositions, "Oui", "raw");
  tryToAddWrongProp(propositions, "Non", "raw");
  tryToAddWrongProp(propositions, "On ne peut pas savoir", "raw");
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const equaDiffCheckSolutionFirstOrder: Exercise<Identifiers> = {
  id: "equaDiffCheckSolutionFirstOrder",
  label:
    "Vérifier si une fonction est solution d'une équation différentielle du premier ordre",
  levels: ["TermTech", "MathComp", "TermSpé"],
  isSingleStep: true,
  sections: ["Équations différentielles"],
  generator: (nb: number) =>
    getDistinctQuestions(getEquaDiffCheckSolutionFirstOrderQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  answerType: "QCU",
  subject: "Mathématiques",
};
