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
import {
  blueMain,
  blues,
  orange,
  oranges,
  purples,
  reds,
} from "#root/geogebra/colors";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { Integer } from "#root/math/numbers/integer/integer";
import { Rational } from "#root/math/numbers/rationals/rational";
import { Polynomial } from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { random } from "#root/utils/random";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  A: number[];
  B: number[];
};

const getDerivativeNumberReading: QuestionGenerator<Identifiers> = () => {
  let xA, yA, xB, yB: number;

  [xA, yA] = [1, 2].map((el) => randint(-5, 6));
  xB = xA > 0 ? randint(xA - 4, 6, [xA]) : randint(-4, xA + 5, [xA]); // l'écart entre les deux points ne soit pas grand
  yB = yA > 0 ? randint(yA - 4, 6) : randint(-4, yA + 5);

  const pente = new Rational(yB - yA, xB - xA).simplify();
  const origin = pente
    .opposite()
    .multiply(new Integer(xA))
    .add(new Integer(yA));
  const penteTree = pente.toTree();
  const originTree = origin.toTree();
  const penteString = penteTree.toMathString();
  const originString = originTree.toMathString();
  const penteValue = pente.value;
  const originValue = origin.value;

  const [a, b] = [
    (3 * randint(-100, 100, [0])) / 100,
    (2 * randint(-4, 5)) / 100,
  ];
  const c = penteValue - a * Math.pow(xA, 2) - b * xA;
  const d = yA - (a / 3) * Math.pow(xA, 3) - (b / 2) * Math.pow(xA, 2) - xA * c;

  const polynome = new Polynomial([d, c, b / 2, a / 3]);

  const instruction = `Ci-dessous sont tracées la courbe $\\mathcal C_f$ de la fonction $f$ et la tangente à cette courbe au point d'abscisse $${xA}$.$\\\\$ Déterminer $f'(${xA})$.`;
  const commands = [
    `f(x) = ${polynome.toString()}`,
    `SetColor(f, "${blueMain}")`,
    `SetCaption(f, "$\\mathcal C_f$")`,
    `ShowLabel(f, true)`,
    `g(x) = (${penteString}) * x + (${originString})`,
    `SetColor(g, "${orange}")`,
    `A = (${xA},${yA})`,
    "SetFixed(A, true)  ",
  ];

  const xMin = Math.min(xA, xB);
  const yMin = Math.min(yA, yB);
  const xMax = Math.max(xA, xB);
  const yMax = Math.max(yA, yB);
  const ggb = new GeogebraConstructor(commands, {
    isGridSimple: true,
  });
  const answer = penteTree.toTex();
  const question: Question<Identifiers> = {
    instruction,
    startStatement: "a",
    answer,
    commands: ggb.commands,
    // coords: ggb.getAdaptedCoords({ xMax, xMin, yMax, yMin }),
    coords: [xMin - 5, xMax + 5, yMin - 5, yMax + 5],
    options: ggb.getOptions(),
    answerFormat: "tex",
    keys: [],
    identifiers: { A: [xA, yA], B: [xB, yB] },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, A, B }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  if (B[1] - A[1] !== 0)
    tryToAddWrongProp(
      propositions,
      new Rational(B[0] - A[0], B[1] - A[1]).simplify().toTree().toTex(),
    );
  while (propositions.length < n) {
    const wrongAnswer = new NumberNode(randint(-4, 5, [0]));
    tryToAddWrongProp(propositions, wrongAnswer.toTex());
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { A, B }) => {
  const answer = new Rational(B[1] - A[1], B[0] - A[0])
    .simplify()
    .toTree({ allowFractionToDecimal: true });
  const texs = answer.toAllValidTexs();
  console.log(texs);
  return texs.includes(ans);
};

export const derivativeNumberReading: MathExercise<Identifiers> = {
  id: "derivativeNumberReading",
  connector: "=",
  label: "Lecture de nombre dérivé",
  levels: ["1reESM", "1reSpé", "1reTech", "MathComp", "1rePro"],
  sections: ["Dérivation"],
  isSingleStep: false,
  generator: (nb: number) =>
    getDistinctQuestions(getDerivativeNumberReading, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
