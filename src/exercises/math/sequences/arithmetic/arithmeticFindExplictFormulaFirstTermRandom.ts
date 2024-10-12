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
import { Polynomial } from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { shuffle } from "#root/utils/alea/shuffle";

type Identifiers = {
  firstValue: number;
  reason: number;
  firstRank: number;
};

const getArithmeticFindExplicitFormulaFirstTermRandom: QuestionGenerator<
  Identifiers
> = () => {
  const firstRank = randint(0, 8);
  const firstValue = randint(-10, 10);
  const reason = randint(-10, 10, [0]);

  const formula = new Polynomial(
    [firstValue - firstRank * reason, reason],
    "n",
  );
  const answer = "u_n=" + formula.toTex();
  const question: Question<Identifiers> = {
    instruction: `$(u_n)$ est une suite arithmétique de premier terme $u_{${firstRank}} = ${firstValue}$ et de raison $r = ${reason}$. $\\\\$ Donner l'expression de $u_n$ en fonction de $n$.`,
    answer,
    keys: ["un", "equal", "n"],
    answerFormat: "tex",
    identifiers: { firstValue, reason, firstRank },
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
      "u_n=" +
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

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { reason, firstValue, firstRank },
) => {
  const formula = new Polynomial(
    [firstValue - firstRank * reason, reason],
    "n",
  );

  const equal = new EqualNode(new VariableNode("u_n"), formula.toTree(), {
    allowRawRightChildAsSolution: true,
  });
  const texs = equal.toAllValidTexs();

  return texs.includes(ans);
};

export const arithmeticFindExplicitFormulaFirstTermRandom: Exercise<Identifiers> =
  {
    id: "arithmeticFindExplicitFormulaFirstTermRandom",
    connector: "=",
    label:
      "Déterminer la formule générale d'une suite arithmétique (premier rang aléatoire)",
    levels: ["1reESM", "1reSpé", "1reTech", "1rePro", "TermTech", "TermPro"],
    sections: ["Suites"],
    isSingleStep: false,
    generator: (nb: number) =>
      getDistinctQuestions(getArithmeticFindExplicitFormulaFirstTermRandom, nb),
    qcmTimer: 60,
    freeTimer: 60,
    getPropositions,
    isAnswerValid,
    subject: "Mathématiques",
  };
