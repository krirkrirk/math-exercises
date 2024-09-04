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
import { Rational } from "#root/math/numbers/rationals/rational";
import { AffineConstructor } from "#root/math/polynomials/affine";
import { randint } from "#root/math/utils/random/randint";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";

import { shuffle } from "#root/utils/shuffle";
type Identifiers = {
  xA: number;
  xB: number;
  yA: number;
  yB: number;
};

const getAffineExpressionFromTwoImagesQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const [xA, yA] = [1, 2].map((el) => randint(-9, 10));
  const xB = randint(-9, 10, [xA]);
  const yB = randint(-9, 10);
  const a = new Rational(yB - yA, xB - xA).simplify().toTree();
  //yA = axA+b donc b = yA-axA
  const b = new SubstractNode(
    yA.toTree(),
    new MultiplyNode(a, xA.toTree()),
  ).simplify();
  const answer = new AddNode(new MultiplyNode(a, new VariableNode("x")), b)
    .simplify({ forceDistributeFractions: true })
    .toTex();
  console.log(a.toTex(), b.toTex());

  const question: Question<Identifiers> = {
    instruction: `Soit $f$ une fonction affine telle que $f(${xA}) = ${yA}$ et $f(${xB}) = ${yB}$.
    
Quelle est l'expression algébrique de $f$ ?`,
    startStatement: "a",
    answer,
    hint: "Calcule d'abord le taux d'accroissement de $f$ en utilisant la formule $a = \\frac{y_2-y_1}{x_2-x_1}$. Ensuite, utilise les coordonnées d'un des deux points pour déterminer l'ordonnée à l'origine.",
    correction: `On calcule d'abord le taux d'accroissement $a$ : 
    
$a = \\frac{y_2-y_1}{x_2-x_1} = \\frac{${yB}-${yA}}{${xB}-${xA}} = ${a.toTex()}$

Il faut ensuite trouver l'ordonnée à l'origine $b$. On sait que $f(${xA}) = ${yA}$. Or pour tout $x$ réel, on a $f(x) = ax+b$. 

Donc $${yA} = ${new MultiplyNode(
      a,
      xA.toTree(),
    ).toTex()}+b$. On a donc $b = ${new SubstractNode(
      yA.toTree(),
      new MultiplyNode(a, xA.toTree()),
    ).toTex()} = ${b.toTex()}$.

Ainsi, $f(x) = ${answer}$.
    `,
    answerFormat: "tex",
    keys: ["x"],
    identifiers: { xA, xB, yA, yB },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, xA, xB, yA, yB },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    const wrongAnswer = AffineConstructor.random().toTex();
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { xA, xB, yA, yB }) => {
  const a = new Rational(yB - yA, xB - xA).simplify().toTree();
  //yA = axA+b donc b = yA-axA
  const b = new SubstractNode(
    yA.toTree(),
    new MultiplyNode(a, xA.toTree()),
  ).simplify();
  const answer = new AddNode(new MultiplyNode(a, new VariableNode("x")), b, {
    allowFractionToDecimal: true,
  }).simplify({ forceDistributeFractions: true });

  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};

export const affineExpressionFromTwoImages: Exercise<Identifiers> = {
  id: "affineExpressionFromTwoImages",
  connector: "=",
  label: "Expression algébrique d'une fonction affine via deux images",
  levels: ["3ème", "2nde", "2ndPro", "1rePro", "1reTech"],
  isSingleStep: true,
  sections: ["Fonctions affines", "Droites"],
  generator: (nb: number) =>
    getDistinctQuestions(getAffineExpressionFromTwoImagesQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
