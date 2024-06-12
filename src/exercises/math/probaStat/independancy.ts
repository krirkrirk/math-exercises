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
import { DecimalConstructor } from "#root/math/numbers/decimals/decimal";
import { frenchify } from "#root/math/utils/latex/frenchify";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { coinFlip } from "#root/utils/coinFlip";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  pA: number;
  pB: number;
  pUnion: number;
};

const getIndependancyQuestion: QuestionGenerator<Identifiers> = () => {
  const pA = DecimalConstructor.random(0, 1, randint(1, 3));
  const pATree = pA.toTree();
  const pB = DecimalConstructor.random(0, 1, randint(1, 3));
  const pBTree = pB.toTree();
  const areIndependants = coinFlip();
  const answer = areIndependants ? "Oui" : "Non";
  let pUnion: number;
  const unionValueIfIndependants = round(
    pA.value + pB.value - pA.value * pB.value,
    5,
  );
  if (areIndependants) pUnion = unionValueIfIndependants;
  else {
    do {
      pUnion = DecimalConstructor.random(0, 1, randint(1, 3)).value;
    } while (
      (pUnion < pA.value && pUnion < pB.value) ||
      pUnion === unionValueIfIndependants ||
      pUnion > pA.value + pB.value
    );
  }

  const question: Question<Identifiers> = {
    answer,
    instruction: `Soient deux événements $A$ et $B$ tels que $P(A) = ${frenchify(
      pA.value,
    )}$, $P(B) = ${frenchify(pB.value)}$ et $P(A\\cup B) = ${frenchify(
      pUnion,
    )}$. Les événements $A$ et $B$ sont-ils indépendants ?`,
    keys: [],
    answerFormat: "raw",
    identifiers: { pA: pA.value, pB: pB.value, pUnion },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");
  tryToAddWrongProp(propositions, "Oui", "raw");
  tryToAddWrongProp(propositions, "Non", "raw");
  tryToAddWrongProp(propositions, "On ne peut pas savoir", "raw");
  return shuffle(propositions);
};

export const independancy: Exercise<Identifiers> = {
  id: "independancy",
  connector: "=",
  label:
    "Déterminer l'indépendance de deux événements via la formule de Poincaré",
  levels: ["1reSpé", "TermTech"],
  isSingleStep: true,
  sections: ["Probabilités"],
  generator: (nb: number) => getDistinctQuestions(getIndependancyQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  answerType: "QCM",
  subject: "Mathématiques",
};
