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
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { shuffle } from "#root/utils/alea/shuffle";
type Identifiers = {
  reason: number;
  firstValue: number;
};
const getGeometricFindExplicitFormula: QuestionGenerator<Identifiers> = () => {
  const firstRank = 0;
  const firstValue = randint(1, 10);
  const reason = randint(2, 10);

  const formula = new MultiplyNode(
    new NumberNode(firstValue),
    new PowerNode(new NumberNode(reason), new VariableNode("n")),
  );

  const answer = "u_n=" + formula.toTex();

  const question: Question<Identifiers> = {
    instruction: `$(u_n)$ est une suite géométrique de premier terme $u_{${firstRank}} = ${firstValue}$ et de raison $q = ${reason}$. $\\\\$ Donner l'expression de $u_n$ en fonction de $n$.`,

    answer,
    keys: ["un", "equal", "n"],
    answerFormat: "tex",
    identifiers: { reason, firstValue },
    hint: `Utilise la formule générale d'une suite géométrique : 
    
$u_n = u_0 \\times r^n $,

où $u_0$ est le premier terme et $r$ la raison.`,
    correction: `La formule générale d'une suite géométrique est :
    
$u_n = u_0 \\times r^n $,

où $u_0$ est le premier terme et $r$ la raison.
    
Ici, puisque $u_0 = ${firstValue}$ et $r = ${reason}$, on a : 

$${answer}$`,
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, reason, firstValue },
) => {
  const propositions: Proposition[] = [];

  addValidProp(propositions, answer);

  tryToAddWrongProp(
    propositions,
    "u_n=" +
      new MultiplyNode(
        new NumberNode(reason),
        new PowerNode(new NumberNode(firstValue), new VariableNode("n")),
      ).toTex(),
  );

  while (propositions.length < n) {
    const wrongAnswer = new MultiplyNode(
      new NumberNode(firstValue + randint(-firstValue, 2 * firstValue + 1)),
      new PowerNode(
        new NumberNode(reason + +randint(-reason + 1, 2 * reason + 1)),
        new VariableNode("n"),
      ),
    );
    tryToAddWrongProp(propositions, "u_n=" + wrongAnswer.toTex());
  }
  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { reason, firstValue }) => {
  const formula = new MultiplyNode(
    new NumberNode(firstValue),
    new PowerNode(new NumberNode(reason), new VariableNode("n")),
  );
  const equal = new EqualNode(new VariableNode("u_n"), formula, {
    allowRawRightChildAsSolution: true,
  });
  const texs = equal.toAllValidTexs();
  return texs.includes(ans);
};

export const geometricFindExplicitFormula: Exercise<Identifiers> = {
  id: "geometricFindExplicitFormula",
  connector: "=",
  label: "Déterminer la formule générale d'une suite géométrique",
  levels: ["1reESM", "1reSpé", "1reTech", "1rePro", "TermTech", "TermPro"],
  sections: ["Suites"],
  isSingleStep: false,
  generator: (nb: number) =>
    getDistinctQuestions(getGeometricFindExplicitFormula, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
