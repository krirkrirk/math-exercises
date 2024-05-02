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
import {
  Polynomial,
  PolynomialConstructor,
} from "#root/math/polynomials/polynomial";
import { Trinom, TrinomConstructor } from "#root/math/polynomials/trinom";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";

type Identifiers = {
  quadcoeffs: number[];
};

const getInflexionPointQuadrinomialsQuestion: QuestionGenerator<
  Identifiers
> = () => {
  let quadrinomial;
  let quadcoeffs;
  do {
    quadrinomial = PolynomialConstructor.randomWithOrder(3);
    quadcoeffs = quadrinomial.coefficients;
  } while (quadcoeffs[1] === 0 || quadcoeffs[2] === 0);

  const secondderivative = quadrinomial.derivate().derivate();
  const seconddcoeffs = secondderivative.coefficients;

  const inflexionPoint = new FractionNode(
    new MultiplyNode(seconddcoeffs[0].toTree(), new NumberNode(-1)),
    seconddcoeffs[1].toTree(),
  )
    .simplify()
    .toTex();

  const question: Question<Identifiers> = {
    answer: inflexionPoint,
    instruction: `Soit la fonction $f(x) = ${quadrinomial.toTex()}$. Calculer l'abscisse de son point d'inflexion.`,
    keys: [],
    answerFormat: "tex",
    identifiers: { quadcoeffs },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, quadcoeffs },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const quadrinomial = new Polynomial(quadcoeffs);
  const firstdderivative = quadrinomial.derivate();
  const trinomialcoeffs = firstdderivative.coefficients;
  const trinomial = new Trinom(
    trinomialcoeffs[2],
    trinomialcoeffs[1],
    trinomialcoeffs[0],
  );
  const firstroots = trinomial.getRootsNode();
  const secondderivative = quadrinomial.derivate().derivate();
  const seconddcoeffs = secondderivative.coefficients;

  const wrongAnswer1 = new FractionNode(
    seconddcoeffs[0].toTree(),
    seconddcoeffs[1].toTree(),
  )
    .simplify()
    .toTex();

  const wrongAnswer2 = new FractionNode(
    seconddcoeffs[1].toTree(),
    seconddcoeffs[0].toTree(),
  )
    .simplify()
    .toTex();

  tryToAddWrongProp(propositions, wrongAnswer1);
  tryToAddWrongProp(propositions, wrongAnswer2);

  if (firstroots.length != 0) {
    for (let i = 0; i < firstroots.length; i++) {
      tryToAddWrongProp(propositions, firstroots[i].simplify().toTex());
    }
  }

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(-1, 2).toString());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, quadcoeffs }) => {
  const quadrinomial = new Polynomial(quadcoeffs);
  const secondderivative = quadrinomial.derivate().derivate();
  const seconddcoeffs = secondderivative.coefficients;

  const inflexionPoint = new FractionNode(
    new MultiplyNode(seconddcoeffs[0].toTree(), new NumberNode(-1)),
    seconddcoeffs[1].toTree(),
  ).simplify();

  const latexs = inflexionPoint.toAllValidTexs({
    allowFractionToDecimal: true,
  });

  return latexs.includes(ans);
};
export const inflexionPointQuadrinomials: Exercise<Identifiers> = {
  id: "inflexionPointQuadrinomials",
  label: "Calcul du point d'inflexion (quadrinôme)",
  levels: ["TermSpé"],
  isSingleStep: true,
  sections: ["Dérivation"],
  generator: (nb: number) =>
    getDistinctQuestions(getInflexionPointQuadrinomialsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
