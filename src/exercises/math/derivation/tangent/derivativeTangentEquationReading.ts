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
  GetAnswer,
  GetHint,
  GetCorrection,
  GetInstruction,
  GetKeys,
  GetGGBOptions,
  GetStudentGGBOptions,
  GetGGBAnswer,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { blueMain, orange } from "#root/geogebra/colors";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { Rational } from "#root/math/numbers/rationals/rational";
import { Trinom } from "#root/math/polynomials/trinom";
import { randint } from "#root/math/utils/random/randint";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { NodeConstructor } from "#root/tree/nodes/nodeConstructor";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { alignTex } from "#root/utils/latex/alignTex";
import { random } from "#root/utils/random";

type Identifiers = {
  xA: number;
  yA: number;
  yPrimeA: any;
  trinomCoeffs: number[];
};

const randomPente = () => {
  return random([
    0,
    -1,
    1,
    -2,
    2,
    -3,
    3,
    new Rational(1, 2),
    new Rational(-1, 2),
    new Rational(1, 3),
    new Rational(-1, 3),
    new Rational(3, 2),
    new Rational(-3, 2),
    new Rational(2, 3),
    new Rational(-2, 3),
    new Rational(3, 4),
    new Rational(-3, 4),
    new Rational(1, 4),
    new Rational(-1, 4),
  ]).toTree();
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, trinomCoeffs, xA, yA, yPrimeA },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(
    propositions,
    new EqualNode(
      "y".toTree(),
      getAnswerTree({ xA: -xA, yA, yPrimeA, trinomCoeffs }),
    ).toTex(),
  );
  tryToAddWrongProp(
    propositions,
    new EqualNode(
      "y".toTree(),
      getAnswerTree({ xA, yA: -yA, yPrimeA, trinomCoeffs }),
    ).toTex(),
  );
  tryToAddWrongProp(
    propositions,
    new EqualNode(
      "y".toTree(),
      getAnswerTree({
        xA,
        yA,
        yPrimeA: randomPente().toIdentifiers(),
        trinomCoeffs,
      }),
    ).toTex(),
  );

  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      new EqualNode(
        "y".toTree(),
        getAnswerTree({
          xA: randint(-10, 10),
          yA: randint(-10, 10),
          yPrimeA,
          trinomCoeffs,
        }),
      ).toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const getAnswerTree = ({ xA, yA, yPrimeA }: Identifiers) => {
  const yPrimeTree = NodeConstructor.fromIdentifiers(yPrimeA) as AlgebraicNode;
  const pente = new MultiplyNode(yPrimeTree, "x".toTree());
  //f(a)-f'(a)a
  const b = new SubstractNode(
    yA.toTree(),
    new MultiplyNode(yPrimeTree, xA.toTree()),
  ).simplify();
  const ansTree = new AddNode(pente, b).simplify({
    forceDistributeFractions: true,
  });
  return ansTree;
};
const getAnswer: GetAnswer<Identifiers> = ({
  trinomCoeffs,
  xA,
  yA,
  yPrimeA,
}) => {
  return new EqualNode(
    "y".toTree(),
    getAnswerTree({ xA, yA, yPrimeA, trinomCoeffs }),
  ).toTex();
};

const getInstruction: GetInstruction<Identifiers> = ({ xA }) => {
  return `Ci-dessous sont tracées la courbe $\\mathcal C_f$ de la fonction $f$ et la tangente à cette courbe au point d'abscisse $${xA}$.$\\\\$ Déterminer l'équation de cette tangente.`;
};

const getHint: GetHint<Identifiers> = (identifiers) => {
  return `L'équation de la tangente à la courbe de $f$ au point d'abscisse $a$ est :
  
$$
y = f'(a)(x-a)+f(a)
$$`;
};
const getCorrection: GetCorrection<Identifiers> = ({
  trinomCoeffs,
  xA,
  yA,
  yPrimeA,
}) => {
  const yPrime = NodeConstructor.fromIdentifiers(yPrimeA) as AlgebraicNode;
  const yPrimeTex = yPrime.toTex();
  const add = new AddNode(
    new MultiplyNode(yPrime, new AddNode("x".toTree(), (-xA).toTree())),
    yA.toTree(),
  );
  return `L'équation de la tangente à la courbe de $f$ au point d'abscisse $a$ est :
  
$$
y = f'(a)(x-a)+f(a)
$$

Ici, on a $a = ${xA}$ et $f(a)=${yA}$.

Puis, on sait que $f'(a)$ est le coefficient directeur de la tangente. On lit graphiquement que le coefficient directeur de la droite est $${yPrimeTex}$. On a donc $f'(a)=${yPrimeTex}$.

Ainsi, l'équation de la tangente est : 
${alignTex([
  ["y", "=", add.toTex()],
  ["", "=", getAnswerTree({ trinomCoeffs, xA, yA, yPrimeA }).toTex()],
])}
`;
};
const getGGBOptions: GetGGBOptions<Identifiers> = ({
  trinomCoeffs,
  xA,
  yA,
  yPrimeA,
}) => {
  const trinom = new Trinom(trinomCoeffs[0], trinomCoeffs[1], trinomCoeffs[2]);
  const ggb = new GeogebraConstructor({
    commands: [
      ...trinom.toGGBCommands({
        name: "f",
        color: blueMain,
        label: "\\mathcal C_f",
      }),
      `A = (${xA},${yA})`,
      "SetFixed(A, true)",
      "SetPointStyle(A, 1)",
      `g(x) = Tangent(f,A)`,
      `SetColor(g, "${orange}")`,
    ],
  });
  return ggb.getOptions({
    coords: ggb.getAdaptedCoords({
      xMin: xA - 5,
      xMax: xA + 5,
      yMax: yA + 5,
      yMin: yA - 5,
      forceShowAxes: true,
    }),
  });
};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return ["y", "equal", "x"];
};
const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, trinomCoeffs, xA, yA, yPrimeA },
) => {
  const tree = getAnswerTree({ xA, yA, yPrimeA, trinomCoeffs });
  const equalTree = new EqualNode(
    "y".toTree(),
    getAnswerTree({ xA, yA, yPrimeA, trinomCoeffs }),
  );
  return equalTree
    .toAllValidTexs({
      allowMinusAnywhereInFraction: true,
      allowFractionToDecimal: true,
      allowRawRightChildAsSolution: true,
    })
    .includes(ans);
};

const getDerivativeTangentEquationReadingQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const xA = randint(-8, 8);
  const yA = randint(-8, 8);
  const yPrimeA = randomPente();

  let a: number, b: number, c: number;
  if (xA === 0) {
    c = yA;
    b = yPrimeA.evaluate({});
    a = randint(-5, 5, [0]);
  } else {
    c = randint(-5, 5, [yA - xA * yPrimeA.evaluate({})]);
    a = new Rational(
      new AddNode(
        new MultiplyNode(xA.toTree(), yPrimeA),
        new SubstractNode(c.toTree(), yA.toTree()),
      ).evaluate({}),
      xA ** 2,
    )
      .toTree()
      .evaluate({});
    b = new SubstractNode(
      yPrimeA,
      new MultiplyNode(
        (2 / xA).toTree(),
        new AddNode(
          new MultiplyNode(xA.toTree(), yPrimeA),
          new SubstractNode(c.toTree(), yA.toTree()),
        ),
      ),
    ).evaluate({});
  }
  const identifiers: Identifiers = {
    xA,
    yA,
    yPrimeA: yPrimeA.toIdentifiers(),
    trinomCoeffs: [a, b, c],
  };

  const question: Question<Identifiers> = {
    answer: getAnswer(identifiers),
    instruction: getInstruction(identifiers),
    keys: getKeys(identifiers),
    answerFormat: "tex",
    identifiers,
    hint: getHint(identifiers),
    correction: getCorrection(identifiers),
    ggbOptions: getGGBOptions(identifiers),
  };

  return question;
};

export const derivativeTangentEquationReading: Exercise<Identifiers> = {
  id: "derivativeTangentEquationReading",
  connector: "=",
  label: "Déterminer graphiquement l'équation d'une tangente",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getDerivativeTangentEquationReadingQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  ggbTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  getHint,
  getCorrection,
  getAnswer,
  hasGeogebra: true,
  hasHintAndCorrection: true,
  getGGBOptions,
};

/**Math
 * 


xA yA sur la courbe
xA y'A dérivée
a,b,c ?

yA = axA^2 + bxA + c
y'A = 2axA + b

fixons c

yA-c = axA² + bxA
y'A = 2axA +b

xAy'A = 2axA² + bxA
 = yA-c +axA²
 
a = (xAy'A-yA+c)/xA²
b = y'A - 2(xAy'A-yA+c)/xA


SI XA=0
yA =c
y'A = b
a is whatever


y = f'(a)(x-a)+f(a)

 */
