import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { Integer } from "#root/math/numbers/integer/integer";
import { Rational } from "#root/math/numbers/rationals/rational";
import { gcd } from "#root/math/utils/arithmetic/gcd";
import { randint } from "#root/math/utils/random/randint";
import { shuffle } from "#root/utils/shuffle";
import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "../exercise";
import { getDistinctQuestions } from "../utils/getDistinctQuestions";

type Identifiers = {
  type: number;
  A: number;
  B: number;
  AC: number;
  AD: number;
  BC: number;
  BD: number;
};

const getAnswerNode = ({ type, A, B, AC, AD, BC, BD }: Identifiers) => {
  const pA = new Rational(A, A + B).simplify();
  const pB = new Rational(B, A + B).simplify();
  const pA_C = new Rational(AC, AC + AD).simplify();
  const pA_D = new Rational(AD, AC + AD).simplify();
  const pB_C = new Rational(BC, BC + BD).simplify();
  const pB_D = new Rational(BD, BC + BD).simplify();
  switch (type) {
    case 1:
      return pA.multiply(pA_C);
    case 2:
      return pA.multiply(pA_D);
    case 3:
      return pB.multiply(pB_C);
    case 4:
    default:
      return pB.multiply(pB_D);
  }
};

const getProbabilityTree: QuestionGenerator<Identifiers> = () => {
  const A = randint(2, 9);
  const B = randint(2, 10 - A);
  const AC = randint(2, 9);
  const AD = randint(2, 10 - AC);
  const BC = randint(2, 9);
  const BD = randint(2, 10 - BC);

  let instruction = `En utilisant l'arbre de probabilité suivant, `;
  let startStatement = "";

  const type = randint(1, 5);
  const answer = getAnswerNode({ type, A, AC, AD, B, BC, BD });
  const answerTex = answer.toTree().toTex();
  switch (type) {
    case 1: {
      instruction += `calculer $P(A \\cap C)$.`;
      startStatement = `P(A \\cap C)`;
      break;
    }
    case 2: {
      instruction += `calculer $P(A \\cap D)$.`;
      startStatement = `P(A \\cap D)`;
      break;
    }
    case 3: {
      instruction += `calculer $P(B \\cap C)$.`;
      startStatement = `P(B \\cap C)`;
      break;
    }
    case 4: {
      instruction += `calculer $P(B \\cap D)$.`;
      startStatement = `P(B \\cap D)`;
      break;
    }
  }

  let commands = [
    "A = Point({2,2})",
    "B = Point({2,-2})",
    "AC = Point({5,3})",
    "AD = Point({5,1})",
    "BC = Point({5,-1})",
    "BD = Point({5,-3})",
    "Segment(Point({0,0}),A)",
    "Segment(A,AC)",
    "Segment(A,AD)",
    "Segment(Point({0,0}),B)",
    "Segment(B,BC)",
    "Segment(B,BD)",
    `Text("\\scriptsize ${A / gcd(A, A + B)}/${
      (A + B) / gcd(A, A + B)
    }", (0.3, 2.1), true, true)`,
    `Text("\\scriptsize ${AC / gcd(AC, AC + AD)}/${
      (AC + AD) / gcd(AC, AC + AD)
    }", (2.8, 3.5), true, true)`,
    `Text("\\scriptsize ${AD / gcd(AD, AC + AD)}/${
      (AC + AD) / gcd(AD, AC + AD)
    }", (2.8, 1.4), true, true)`,
    `Text("\\scriptsize ${B / gcd(B, A + B)}/${
      (A + B) / gcd(B, A + B)
    }", (0.3, -1.2), true, true)`,
    `Text("\\scriptsize ${BC / gcd(BC, BC + BD)}/${
      (BC + BD) / gcd(BC, BC + BD)
    }", (2.8, -0.6), true, true)`,
    `Text("\\scriptsize ${BD / gcd(BD, BC + BD)}/${
      (BC + BD) / gcd(BD, BC + BD)
    }", (2.8, -2.5), true, true)`,
    'Text("A", (1.85 , 2.5))',
    'Text("B", (1.85 , -2.8))',
    'Text("C", (5.5 , 2.85))',
    'Text("D", (5.5 , 0.85))',
    'Text("C", (5.5 , -1.1))',
    'Text("D", (5.5 , -3.1))',
  ];

  const ggb = new GeogebraConstructor(commands, {
    hideAxes: true,
    hideGrid: true,
  });
  const question: Question<Identifiers> = {
    instruction,
    startStatement,
    answer: answerTex,
    keys: [],
    commands,
    options: ggb.getOptions(),
    coords: [-2, 8, -5, 5],
    answerFormat: "tex",
    identifiers: { A, AC, AD, B, BC, BD, type },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, A, AC, AD, B, BC, BD, type },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const answerNode = getAnswerNode({ A, AC, AD, B, BC, BD, type });
  while (propositions.length < n) {
    const wrongAnswer = answerNode.multiply(new Integer(randint(2, 11)));
    tryToAddWrongProp(propositions, wrongAnswer.toTree().toTex());
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { A, AC, AD, B, BC, BD, type },
) => {
  const answer = getAnswerNode({ type, A, AC, AD, B, BC, BD });
  const texs = answer.toTree({ allowFractionToDecimal: true }).toAllValidTexs();
  console.log(texs);
  return texs.includes(ans);
};

export const probabilityTree: Exercise<Identifiers> = {
  id: "probabilityTree",
  connector: "=",
  label: "Calculs de probabilités à l'aide d'un arbre pondéré",
  levels: [
    "2nde",
    "1reESM",
    "1reSpé",
    "1reTech",
    "1rePro",
    "TermPro",
    "TermTech",
  ],
  isSingleStep: false,
  sections: ["Probabilités"],
  generator: (nb: number) => getDistinctQuestions(getProbabilityTree, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  hasGeogebra: true,
  subject: "Mathématiques",
};
