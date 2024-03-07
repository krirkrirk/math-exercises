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
import { Polynomial } from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  firstValue: number;
  reason: number;
};

const getArithmeticFindExplicitFormula: QuestionGenerator<Identifiers> = () => {
  const firstRank = 0;
  const firstValue = randint(-10, 10);
  const reason = randint(-10, 10, [0]);

  const formula = new Polynomial([firstValue, reason], "n");
  const answer = "u_n=" + formula.toTex();
  const question: Question<Identifiers> = {
    instruction: `$(u_n)$ est une suite arithmétique de premier terme $u_{${firstRank}} = ${firstValue}$ et de raison $r = ${reason}$. $\\\\$ Donner l'expression de $u_n$ en fonction de $n$.`,
    answer,
    keys: ["un", "equal", "n"],
    answerFormat: "tex",
    identifiers: { firstValue, reason },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, firstValue, reason },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      new Polynomial(
        [firstValue + randint(-3, 4), reason + randint(-3, 4, [-reason])],
        "n",
      )
        .toTree()
        .toTex(),
    );
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { reason, firstValue }) => {
  const formula = new Polynomial([firstValue, reason], "n");

  const equal = new EqualNode(new VariableNode("u_n"), formula.toTree(), {
    allowRawRightChildAsSolution: true,
  });
  const texs = equal.toAllValidTexs();
  console.log(texs);
  return texs.includes(ans);
};

export const arithmeticFindExplicitFormula: MathExercise<Identifiers> = {
  id: "arithmeticFindExplicitFormula",
  connector: "=",
  label: "Déterminer la formule générale d'une suite arithmétique",
  levels: ["1reESM", "1reSpé", "1reTech", "1rePro", "TermTech", "TermPro"],
  sections: ["Suites"],
  isSingleStep: false,
  generator: (nb: number) =>
    getDistinctQuestions(getArithmeticFindExplicitFormula, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
