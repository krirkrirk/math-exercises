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
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { alignTex } from "#root/utils/latex/alignTex";
import { shuffle } from "#root/utils/alea/shuffle";

type Identifiers = {
  firstValue: number;
  reason: number;
  askedRank: number;
};

const getGeometricExplicitFormulaUsage: QuestionGenerator<Identifiers> = () => {
  const askedRank = randint(0, 10);
  const firstValue = randint(-5, 10, [0]);
  const reason = randint(2, 10);
  const formula = new MultiplyNode(
    new NumberNode(firstValue),
    new PowerNode(new NumberNode(reason), new VariableNode("n")),
  );
  const formulaTex = formula.toTex();
  const answer = (firstValue * Math.pow(reason, askedRank)).toString();
  const question: Question<Identifiers> = {
    instruction: `$(u_n)$ est une suite géométrique définie par $u_n = ${formulaTex}$. Calculer : $u_{${askedRank}}$`,
    startStatement: `u_{${askedRank}}`,
    answer,
    keys: ["u", "underscore", "equal"],
    answerFormat: "tex",
    identifiers: { firstValue, reason, askedRank },
    hint: `Il suffit de remplacer $n$ par $${askedRank}$ dans la formule donnée.`,
    correction: `On remplace $n$ par $${askedRank}$ dans la formule donnée : 
    
${alignTex([
  [
    `u_{${askedRank}}`,
    "=",
    new MultiplyNode(
      new NumberNode(firstValue),
      new PowerNode(new NumberNode(reason), askedRank.toTree()),
    ).toTex(),
  ],
  ["", "=", answer],
])}`,
  };
  return question;
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, askedRank }) => {
  return [
    answer,
    `u_{${askedRank}}=${answer}`,
    `u_${askedRank}=${answer}`,
  ].includes(ans);
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, firstValue, reason, askedRank },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      (firstValue * Math.pow(reason, randint(0, 9, [askedRank]))).toString(),
    );
  }

  return shuffle(propositions);
};

export const geometricExplicitFormulaUsage: Exercise<Identifiers> = {
  id: "geometricExplicitFormulaUsage",
  connector: "=",
  label: "Utiliser la formule générale d'une suite géométrique",
  levels: ["1reESM", "1reSpé", "1reTech", "1rePro", "TermTech", "TermPro"],
  sections: ["Suites"],
  isSingleStep: false,
  generator: (nb: number) =>
    getDistinctQuestions(getGeometricExplicitFormulaUsage, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
