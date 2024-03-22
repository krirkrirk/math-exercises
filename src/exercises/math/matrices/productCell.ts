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
import { randint } from "#root/math/utils/random/randint";
import { sum } from "#root/math/utils/sum";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { doWhile } from "#root/utils/doWhile";

type Identifiers = {
  AiCoeff: number;
  AjCoeff: number;
  BiCoeff: number;
  BjCoeff: number;
};
//$A=(a_{i,j})$ avec $a_{i,j}=2i-j$ et $B=(b_{i,j})$ avec $b_{i,j}=i+j$ calculer $c_{2,3}$ Réponse: $c_{2,3} = \sum_{k=1}^{3} (2 \cdot 2 - k) \cdot (k + 3)$ $ c_{2,3} = (2 \cdot 2 - 1) \cdot (1 + 3) + (2 \cdot 2 - 2) \cdot (2 + 3) + (2 \cdot 2 - 3) \cdot (3 + 3)$ $c_{2,3}=3\times 4+2\times 5+1\times 6 =28$. Si l'élève détermine l'expression des matrices A et B puis effectue le calcul des bons blocs pour obtenir le coefficient cela est intéressant aussi ! Bonne journée merci

// Les matrices A et B sont définies par combinaisons linéaires de leurs lignes/colonnes
// exp a_(i,j) = 2i+j
const getProductCellQuestion: QuestionGenerator<Identifiers> = () => {
  const i = randint(1, 4);
  const j = randint(1, 4);
  const AiCoeff = randint(-3, 4, [0]);
  const AjCoeff = randint(-3, 4, [0]);
  const BiCoeff = randint(-3, 4, [0]);
  const BjCoeff = doWhile(
    () => randint(-3, 4, [0]),
    (x: number) => BiCoeff === AiCoeff && x === AjCoeff,
  );

  const aij = new AddNode(
    new MultiplyNode(AiCoeff.toTree(), new VariableNode("i")),
    new MultiplyNode(AjCoeff.toTree(), new VariableNode("j")),
  ).simplify();
  const bij = new AddNode(
    new MultiplyNode(BiCoeff.toTree(), new VariableNode("i")),
    new MultiplyNode(BjCoeff.toTree(), new VariableNode("j")),
  ).simplify();
  const answer =
    sum(
      1,
      3,
      (k) => (AiCoeff * i + AjCoeff * k) * (BiCoeff * k + BjCoeff * j),
    ) + "";
  const question: Question<Identifiers> = {
    answer,
    instruction: `Soient  $A = \\left(a_{i,j}\\right)$ et $B = \\left(b_{i,j}\\right)$ deux matrices carrées d'ordre $3$, avec $a_{i,j} = ${aij.toTex()}$ et $b_{i,j} = ${bij.toTex()}$. Soit $C = AB$. Calculer $c_{${i},${j}}$.`,
    keys: [],
    answerFormat: "tex",
    identifiers: { AiCoeff, AjCoeff, BiCoeff, BjCoeff },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(-100, 100) + "");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const productCell: Exercise<Identifiers> = {
  id: "productCell",
  connector: "=",
  label: "Calculer un coefficient du produit de deux matrices",
  levels: ["MathExp"],
  isSingleStep: true,
  sections: ["Matrices"],
  generator: (nb: number) => getDistinctQuestions(getProductCellQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
