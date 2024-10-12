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
import { randomColor } from "#root/geogebra/colors";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { Point } from "#root/math/geometry/point";
import { Integer } from "#root/math/numbers/integer/integer";
import { Rational } from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { shuffle } from "#root/utils/alea/shuffle";
type Identifiers = {
  xA: number;
  yA: number;
  xB: number;
  yB: number;
};

const getProportionnalityCoeffFromLineQuestion: QuestionGenerator<
  Identifiers
> = () => {
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

  const xMin = Math.min(xA, xB);
  const xMax = Math.max(xA, xB);
  const yMin = Math.min(yA, yB);
  const yMax = Math.max(yA, yB);

  const commands = [
    `f(x) = (${aString}) * x + (${bString})`,
    `SetColor(f, "${randomColor()}")`,
  ];
  const ggb = new GeogebraConstructor({
    xAxis: { label: "$x$" },
    yAxis: { label: "$y$" },
    commands,
  });
  const answer = aTree.toTex();
  const question: Question<Identifiers> = {
    instruction:
      "Déterminer le coefficient de proportionnalité entre $y$ et $x$ : ",
    answer,
    keys: [],
    ggbOptions: ggb.getOptions({
      coords: ggb.getAdaptedCoords({ xMin, xMax, yMin, yMax }),
    }),
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

export const proportionnalityCoeffFromLine: Exercise<Identifiers> = {
  id: "proportionnalityCoeffFromLine",
  connector: "=",
  label: "Déterminer le coefficient de proportionnalité à l'aide d'une droite",
  levels: ["3ème", "2nde", "1reESM", "2ndPro", "1rePro", "1reTech", "1reSpé"],
  isSingleStep: false,
  sections: ["Droites", "Fonctions affines"],
  generator: (nb: number) =>
    getDistinctQuestions(getProportionnalityCoeffFromLineQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  hasGeogebra: true,
  subject: "Physique",
};
