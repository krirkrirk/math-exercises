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
import { Point } from "#root/math/geometry/point";
import { Integer } from "#root/math/numbers/integer/integer";
import { Rational } from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { shuffle } from "#root/utils/shuffle";
type Identifiers = {
  xA: number;
  yA: number;
  xB: number;
  yB: number;
};

const getLeadingCoefficientQuestion: QuestionGenerator<Identifiers> = () => {
  let xA, yA, xB, yB: number;

  [xA, yA] = [1, 2].map((el) => randint(-5, 6));
  xB = xA > 0 ? randint(xA - 4, 6, [xA]) : randint(-4, xA + 5, [xA]); // l'écart entre les deux points ne soit pas grand
  yB = yA > 0 ? randint(yA - 4, 6) : randint(-4, yA + 5);
  const a = new Rational(yB - yA, xB - xA).simplify();
  const b = a.opposite().multiply(new Integer(xA)).add(new Integer(yA));
  const aTree = a.toTree();
  const bTree = b.toTree();
  const aString = aTree.toMathString();
  const bString = bTree.toMathString();
  const aValue = a.value;
  const bValue = b.value;

  let xmin, xmax, ymin, ymax: number;

  if (bValue > 0) {
    ymax = bValue + 1;
    ymin = -1;
  } else {
    ymin = bValue - 1;
    ymax = 1;
  }
  if (aValue === 0) {
    xmax = 5;
    xmin = -5;
  } else if (-bValue / aValue > 0) {
    xmax = -bValue / aValue + 1;
    xmin = -1;
  } else {
    xmin = -bValue / aValue - 1;
    xmax = 1;
  }

  const answer = aTree.toTex();
  const question: Question<Identifiers> = {
    instruction:
      "Déterminer le coefficient directeur de la droite représentée ci-dessous : ",
    answer,
    keys: [],
    commands: [`f(x) = (${aString}) * x + (${bString})`],
    coords: [xmin, xmax, ymin, ymax],
    answerFormat: "tex",
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
  if (yB - yA !== 0)
    tryToAddWrongProp(
      propositions,
      new Rational(xB - xA, yB - yA).simplify().toTree().toTex(),
    );

  while (propositions.length < n) {
    const wrongAnswer = new NumberNode(randint(-4, 5, [0]));
    tryToAddWrongProp(propositions, wrongAnswer.toTex());
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { xA, xB, yA, yB }) => {
  const leadingCoeff = new Rational(yB - yA, xB - xA)
    .simplify()
    .toTree({ allowFractionToDecimal: true });
  const texs = leadingCoeff.toAllValidTexs();
  return texs.includes(ans);
};

export const leadingCoefficient: MathExercise<Identifiers> = {
  id: "leadingCoefficient",
  connector: "=",
  label: "Lire le coefficient directeur",
  levels: ["3ème", "2nde", "1reESM", "2ndPro", "1rePro", "1reTech"],
  isSingleStep: false,
  sections: ["Droites", "Fonctions affines"],
  generator: (nb: number) =>
    getDistinctQuestions(getLeadingCoefficientQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
