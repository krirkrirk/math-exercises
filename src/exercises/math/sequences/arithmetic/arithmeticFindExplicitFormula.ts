import {
  Exercise,
  GeneratorOption,
  GeneratorOptionTarget,
  GeneratorOptionType,
  GetAnswer,
  GetCorrection,
  GetHint,
  GetInstruction,
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
};

type Options = {
  firstTermRankOne?: boolean;
};

const getInstruction: GetInstruction<Identifiers, Options> = (
  identifiers,
  opts,
) => {
  const firstRank = opts?.firstTermRankOne ? 1 : 0;
  return `$(u_n)$ est une suite arithmétique de premier terme $u_{${firstRank}} = ${identifiers.firstValue}$ et de raison $r = ${identifiers.reason}$. 
  
Donner l'expression de $u_n$ en fonction de $n$.`;
};

const getHint: GetHint<Identifiers, Options> = (identifiers, opts) => {
  const firstRank = opts?.firstTermRankOne ? 1 : 0;

  return `Utilise la formule générale d'une suite arithmétique : 
    
$$
${firstRank === 0 ? "u_n = u_0 + n \\times r" : "u_n = u_1 + (n-1) \\times r"}
$$

où $u_${firstRank}$ est le premier terme et $r$ la raison.`;
};

const getCorrection: GetCorrection<Identifiers, Options> = (
  identifiers,
  opts,
) => {
  const firstRank = opts?.firstTermRankOne ? 1 : 0;
  const answer = getAnswer(identifiers, opts);
  return `La formule générale d'une suite arithmétique est :
    
$$
${firstRank === 0 ? "u_n = u_0 + n \\times r " : "u_n = u_1 + (n-1) \\times r "}
$$

où $u_${firstRank}$ est le premier terme et $r$ la raison.
    
Ici, puisque $u_${firstRank} = ${identifiers.firstValue}$ et $r = ${
    identifiers.reason
  }$, on a : 

$$
${answer}
$$

`;
};

const getAnswer: GetAnswer<Identifiers, Options> = (identifiers, opts) => {
  const { firstValue, reason } = identifiers;
  const formula = opts?.firstTermRankOne
    ? new Polynomial([firstValue - reason, reason], "n")
    : new Polynomial([firstValue, reason], "n");
  const answer = "u_n=" + formula.toTex();
  return answer;
};
const getArithmeticFindExplicitFormula: QuestionGenerator<
  Identifiers,
  Options
> = (opts) => {
  const firstValue = randint(-10, 10);
  const reason = randint(-10, 10, [0]);
  const identifiers = { firstValue, reason };
  const question: Question<Identifiers> = {
    instruction: getInstruction(identifiers, opts),
    answer: getAnswer(identifiers, opts),
    keys: ["un", "equal", "n"],
    answerFormat: "tex",
    identifiers,
    hint: getHint(identifiers, opts),
    correction: getCorrection(identifiers, opts),
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

const isAnswerValid: VEA<Identifiers, Options> = (
  ans,
  { reason, firstValue },
  opts,
) => {
  const formula = opts?.firstTermRankOne
    ? new Polynomial([firstValue - reason, reason], "n")
    : new Polynomial([firstValue, reason], "n");

  const equal = new EqualNode(new VariableNode("u_n"), formula.toTree(), {
    allowRawRightChildAsSolution: true,
  });
  const texs = equal.toAllValidTexs();

  return texs.includes(ans);
};

const options: GeneratorOption[] = [
  {
    id: "firstTermRankOne",
    label: "Utiliser $u_1$ comme premier terme",
    target: GeneratorOptionTarget.generation,
    type: GeneratorOptionType.checkbox,
  },
];
export const arithmeticFindExplicitFormula: Exercise<Identifiers> = {
  id: "arithmeticFindExplicitFormula",
  connector: "=",
  label: "Déterminer la formule générale d'une suite arithmétique",
  levels: ["1reESM", "1reSpé", "1reTech", "1rePro", "TermTech", "TermPro"],
  sections: ["Suites"],
  isSingleStep: false,
  generator: (nb: number, opts) =>
    getDistinctQuestions(() => getArithmeticFindExplicitFormula(opts), nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
  options,
  getAnswer,
  getCorrection,
  getHint,
  getInstruction,
};
