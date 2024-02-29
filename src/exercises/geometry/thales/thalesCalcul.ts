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
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { Rational } from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { Node } from "#root/tree/nodes/node";
import { coinFlip } from "#root/utils/coinFlip";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  sideLengths: number[];
  rand: number;
  rand2: number;
  isAskingC: boolean;
};

const getThales: QuestionGenerator<Identifiers> = () => {
  const vertices = [];
  const code = 65 + randint(0, 22); // Générer un code de caractère majuscule aléatoire (A-Z)
  for (let i = 0; i < 5; i++) vertices.push(String.fromCharCode(code + i));

  const [xA, yA] = [randint(-10, 11), randint(-10, 11)];
  let xB, yB, xC, yC;
  let d1, d2, d3; // distance entre le point A et B
  let theta = 0; // angle entre AB et AC

  do {
    [xB, yB, xC, yC] = [
      randint(-10, 11),
      randint(-10, 11),
      randint(-10, 11),
      randint(-10, 11),
    ];
    d1 = Math.hypot(xB - xA, yB - yA); // Calculer la distance entre A et B
    d2 = Math.hypot(xC - xA, yC - yA); // Calculer la distance entre A et C
    theta = Math.acos(
      ((xB - xA) * (xC - xA) + (yB - yA) * (yC - yA)) / (d1 * d2),
    );
  } while (
    !theta ||
    theta < 0.35 ||
    theta > 2.1 ||
    d1 / d2 > 1.3 ||
    d1 / d2 < 0.7
  );

  d3 = Math.sqrt(d1 ** 2 + d2 ** 2 - 2 * d1 * d2 * Math.cos(theta)); // Calculer la distance entre C et B
  // CB² = AB² * AC² - 2*AB*AC*cos(theta)  : pythagore généralisé

  const factor = randint(-5, 6, [-2, -1, 0, 1, 2]) / 10; // facteur = AB/AE, Pour que l'affichage soit acceptable, les valeurs de factor sont +- 0.5 0.4 0.3

  const [xD, yD] = [xA + factor * (xB - xA), yA + factor * (yB - yA)];
  const [xE, yE] = [xA + factor * (xC - xA), yA + factor * (yC - yA)];

  const xMin = Math.min(xA, xB, xC, xD, xE);
  const xMax = Math.max(xA, xB, xC, xD, xE);
  const yMin = Math.min(yA, yB, yC, yD, yE);
  const yMax = Math.max(yA, yB, yC, yD, yE);

  // AB AC BC AD AE
  const sides = [
    `${vertices[0]}${vertices[1]}`,
    `${vertices[0]}${vertices[3]}`,
    `${vertices[0]}${vertices[2]}`,
    `${vertices[0]}${vertices[4]}`,
    `${vertices[1]}${vertices[2]}`,
    `${vertices[3]}${vertices[4]}`,
  ];

  // round pour avoir des valeurs dans N tout en gardant les proportions pour que ça soit cohérent. sides[i] a pour longueur sideLengths[i]
  const sideLengths = [d1, factor * d1, d2, factor * d2, d3, factor * d3].map(
    (el) => Math.round(Math.abs(el)),
  );

  const rand = randint(0, 3);
  let rand2 = randint(0, 3, [rand]);
  if (sideLengths[2 * rand] === sideLengths[2 * rand2])
    rand2 = randint(0, 3, [rand, rand2]); // condition pour pas prendre 2 longueurs identiques

  let instruction = `Dans la figure ci-dessous, on a $(${vertices[3]}${vertices[4]})//(${vertices[1]}${vertices[2]})$, `;
  let statement: Node;
  let startStatement;

  const isAskingC = coinFlip();
  if (isAskingC) {
    // a/b = c/d on cherche c
    instruction += `$${sides[2 * rand]} = ${sideLengths[2 * rand]}$, $${
      sides[2 * rand + 1]
    } = ${sideLengths[2 * rand + 1]}$, $${sides[2 * rand2]} = ${
      sideLengths[2 * rand2]
    }$. Déterminer $${sides[2 * rand2 + 1]}$.`;

    startStatement = `${sides[2 * rand2 + 1]}`;

    statement = new Rational(
      sideLengths[2 * rand2] * sideLengths[2 * rand + 1],
      sideLengths[2 * rand],
    )
      .simplify()
      .toTree();
  } else {
    // a/b = c/d on cherche d
    instruction += `$${sides[2 * rand]} = ${sideLengths[2 * rand]}$, $${
      sides[2 * rand + 1]
    } = ${sideLengths[2 * rand + 1]}$, $${sides[2 * rand2 + 1]} = ${
      sideLengths[2 * rand2 + 1]
    }$. Déterminer $${sides[2 * rand2]}$.`;

    startStatement = `${sides[2 * rand2]}`;

    statement = new Rational(
      sideLengths[2 * rand2 + 1] * sideLengths[2 * rand],
      sideLengths[2 * rand + 1],
    )
      .simplify()
      .toTree();
  }

  const commands = [
    `${vertices[0]} = Point({${xA}, ${yA}})`,
    `${vertices[1]} = Point({${xB}, ${yB}})`,
    `${vertices[2]} = Point({${xC}, ${yC}})`,
    `${vertices[3]} = Point(${vertices[0]}, Vector(${factor}Vector(${vertices[0]},${vertices[1]})))`,
    `${vertices[4]} = Intersect(Line(${vertices[3]}, Line(${vertices[1]}, ${vertices[2]})) , Line(${vertices[0]}, ${vertices[2]}))`,
    `l = Segment(${vertices[0]}, ${vertices[1]})`,
    `i = Segment(${vertices[0]}, ${vertices[2]})`,
    `j = Segment(${vertices[1]}, ${vertices[2]})`,
    `k = Segment(${vertices[3]}, ${vertices[4]})`,
    `If(${factor} < 0, Segment(${vertices[0]}, ${vertices[3]}))`,
    `If(${factor} < 0, Segment(${vertices[0]}, ${vertices[4]}))`,
    `ShowLabel(${vertices[0]}, true)`,
    `ShowLabel(${vertices[1]}, true)`,
    `ShowLabel(${vertices[2]}, true)`,
    `ShowLabel(${vertices[3]}, true)`,
    `ShowLabel(${vertices[4]}, true)`,
  ];
  const ggb = new GeogebraConstructor(commands, {
    hideAxes: true,
    hideGrid: true,
  });
  const answer = statement.toTex();
  const question: Question<Identifiers> = {
    instruction,
    startStatement,
    answer,
    keys: [],
    commands: ggb.commands,
    options: ggb.getOptions(),
    coords: [xMin - 1, xMax + 1, yMin - 1, yMax + 1],
    answerFormat: "tex",
    identifiers: { isAskingC, rand, rand2, sideLengths },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      new Rational(randint(2, 30), randint(2, 30)).simplify().toTree().toTex(),
    );
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { isAskingC, rand, rand2, sideLengths },
) => {
  let answer: Node;
  if (isAskingC)
    answer = new Rational(
      sideLengths[2 * rand2] * sideLengths[2 * rand + 1],
      sideLengths[2 * rand],
    )
      .simplify()
      .toTree();
  else
    answer = new Rational(
      sideLengths[2 * rand2 + 1] * sideLengths[2 * rand],
      sideLengths[2 * rand + 1],
    )
      .simplify()
      .toTree();
  const texs = answer.toAllValidTexs({ allowFractionToDecimal: true });
  console.log(texs);

  return texs.includes(ans);
};
export const thalesCalcul: MathExercise<Identifiers> = {
  id: "thalesCalcul",
  connector: "=",
  label: "Utiliser le théoreme de Thalès pour faire des calculs",
  levels: ["5ème", "4ème", "3ème", "2nde"],
  isSingleStep: false,
  sections: ["Théorème de Thalès", "Géométrie euclidienne"],
  generator: (nb: number) => getDistinctQuestions(getThales, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
