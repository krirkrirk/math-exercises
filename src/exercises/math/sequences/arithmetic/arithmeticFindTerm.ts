import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  GGBVEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { alignTex } from "#root/utils/alignTex";
import { random } from "#root/utils/random";

type Identifiers = {
  firstRank: number;
  firstTerm: number;
  reason: number;
  askedRank: number;
};

const getArithmeticFindTermQuestion: QuestionGenerator<Identifiers> = () => {
  const firstRank = random([0, 1]);
  const firstTerm = randint(-15, 15);
  const reason = randint(-10, 10, [0]);
  const askedRank = randint(5, 15);
  const answer = firstTerm + reason * (askedRank - firstRank);
  const question: Question<Identifiers> = {
    answer: answer + "",
    instruction: `Soit $u$ la suite arithmétique de premier terme $u_${firstRank} = ${firstTerm}$ et de raison $r = ${reason}$. Calculer $u_{${askedRank}}$.`,
    keys: [],
    answerFormat: "tex",
    identifiers: { firstRank, askedRank, firstTerm, reason },
    hint: `Le terme général d'une suite arithmétique est : 
    
${
  !firstRank
    ? `$u_n = u_0 + r\\times n$, où $u_0$`
    : `$u_n = u_1 + r \\times (n-1)$, où $u_1$`
} est le premier terme et $r$ la raison.`,
    correction: `Le terme général de la suite $u$ est : 

${
  !firstRank
    ? alignTex([
        [`u_n`, "=", `u_0 + r\\times n`],
        [
          "",
          "=",
          new AddNode(
            firstTerm.toTree(),
            new MultiplyNode(reason.toTree(), new VariableNode("n")),
          ).toTex(),
        ],
      ])
    : alignTex([
        [`u_n`, "=", `u_1 + r \\times (n-1)`],
        [
          "",
          "=",
          new AddNode(
            firstTerm.toTree(),
            new MultiplyNode(
              reason.toTree(),
              new SubstractNode(new VariableNode("n"), (1).toTree()),
            ),
          ).toTex(),
        ],
      ])
}    

Il suffit alors de remplacer $n$ par $${askedRank}$ dans la formule : 

${alignTex([
  [
    `u_{${askedRank}}`,
    "=",
    `${new AddNode(
      firstTerm.toTree(),
      new MultiplyNode(reason.toTree(), (askedRank - firstRank).toTree()),
    ).toTex()}`,
  ],
  ["", "=", `${answer}`],
])}
    `,
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, askedRank, firstRank, firstTerm, reason },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const fake = firstTerm + reason * (askedRank - randint(-4, 4, [firstRank]));
    tryToAddWrongProp(propositions, fake + "");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const arithmeticFindTerm: Exercise<Identifiers> = {
  id: "arithmeticFindTerm",
  connector: "=",
  label:
    "Calculer un terme d'une suite arithmétique à partir de son premier terme et sa raison",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getArithmeticFindTermQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
