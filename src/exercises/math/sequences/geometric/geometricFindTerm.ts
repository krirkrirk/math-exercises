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
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { alignTex } from "#root/utils/latex/alignTex";
import { random } from "#root/utils/random";

type Identifiers = {
  firstRank: number;
  firstTerm: number;
  reason: number;
  askedRank: number;
};

const getGeometricFindTermQuestion: QuestionGenerator<Identifiers> = () => {
  const firstRank = random([0, 1]);
  const firstTerm = randint(-10, 10, [0]);
  const reason = randint(2, 6);
  const askedRank = randint(5, 12);
  const answer = firstTerm * Math.pow(reason, askedRank - firstRank);
  const question: Question<Identifiers> = {
    answer: answer + "",
    instruction: `Soit $u$ la suite géométrique de premier terme $u_${firstRank} = ${firstTerm}$ et de raison $q = ${reason}$. Calculer $u_{${askedRank}}$.`,
    keys: [],
    answerFormat: "tex",
    hint: `Le terme général d'une suite geométrique est : 
    
${
  !firstRank
    ? `$u_n = u_0 \\times q^n$, où $u_0$`
    : `$u_n = u_1 \\times q^{n-1}$, où $u_1$`
} est le premier terme et $q$ la raison.`,
    correction: `Le terme général de la suite $u$ est : 

${
  !firstRank
    ? alignTex([
        [`u_n`, "=", `u_0 \\times q^n`],
        [
          "",
          "=",
          new MultiplyNode(
            firstTerm.toTree(),
            new PowerNode(reason.toTree(), new VariableNode("n")),
          ).toTex(),
        ],
      ])
    : alignTex([
        [`u_n`, "=", `u_1 \\times q^{n-1}`],
        [
          "",
          "=",
          new MultiplyNode(
            firstTerm.toTree(),
            new PowerNode(
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
    `${new MultiplyNode(
      firstTerm.toTree(),
      new PowerNode(reason.toTree(), (askedRank - firstRank).toTree()),
    ).toTex()}`,
  ],
  ["", "=", `${answer}`],
])}
    `,
    identifiers: { firstRank, askedRank, firstTerm, reason },
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
    const fake =
      firstTerm * Math.pow(reason, askedRank - randint(-5, 3, [firstRank]));
    tryToAddWrongProp(propositions, fake + "");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const geometricFindTerm: Exercise<Identifiers> = {
  id: "geometricFindTerm",
  connector: "=",
  label:
    "Calculer un terme d'une suite géométrique à partir de son premier terme et sa raison",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getGeometricFindTermQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
