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
import { TriangleConstructor } from "#root/math/geometry/triangles";
import { SquareRoot } from "#root/math/numbers/reals/real";
import { randint } from "#root/math/utils/random/randint";
import { SqrtNode } from "#root/tree/nodes/functions/sqrtNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { KeyId } from "#root/types/keyIds";
import { coinFlip } from "#root/utils/coinFlip";
import { isInt } from "#root/utils/isInt";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  square: number;
  sideLengths: number[];
};

const getPythagoreCalcul: QuestionGenerator<Identifiers> = () => {
  const vertices = [];
  const code = 65 + randint(0, 24); // Générer un code de caractère majuscule aléatoire (A-Z)
  for (let i = 0; i < 3; i++) vertices.push(String.fromCharCode(code + i));

  const triangle = TriangleConstructor.createRandomRightTriangle({
    minRapport: 0.7,
    maxRapport: 1.3,
    names: vertices,
  });

  const sides = [
    triangle.getSideCName(),
    triangle.getSideBName(),
    triangle.getSideAName(),
  ];

  const sideLengths = [
    triangle.getSideCnumber(),
    triangle.getSideBnumber(),
    triangle.getSideAnumber(),
  ].map((el) => Math.round(el / 2));

  const zeroOrOne = shuffle([0, 1]);
  const randoms = coinFlip() ? [...zeroOrOne, 2] : [2, ...zeroOrOne];
  // le but est d'avoir une chance sur 2 d'avoir un hépoténus et une 1 chance sur 2 d'avoir un a des 2 autres cote
  let answer: string;
  let square: number;
  if (randoms[2] === 2) {
    // cas de l'hypoténus
    square = sideLengths[0] ** 2 + sideLengths[1] ** 2;
  } else {
    // les deux autres cotés
    square = sideLengths[randoms[0]] ** 2 - sideLengths[randoms[1]] ** 2;
  }

  const sqrt = Math.sqrt(square);
  answer = isInt(sqrt) ? sqrt + "" : `\\sqrt{${square}}`;

  const commands = [
    ...triangle.generateCommands({
      showLabels: [...sides, sides[randoms[2]]],
      setCaptions: [...sideLengths.map((el) => el + ""), "?"],
      highlightedSide: sides[randoms[2]],
    }),
  ];
  const ggb = new GeogebraConstructor(commands, {
    hideAxes: true,
    hideGrid: true,
  });
  answer = answer + "";
  const question: Question<Identifiers> = {
    instruction: `Dans le triangle $${triangle.getTriangleName()}$ rectangle en $${triangle.getRightAngle()}$, on sait que $${
      sides[randoms[0]]
    } = ${sideLengths[randoms[0]]}$ et que $${sides[randoms[1]]} = ${
      sideLengths[randoms[1]]
    }$. Calculer la longueur exacte $${sides[randoms[2]]}$.`,
    answer,
    keys: [...(vertices as KeyId[]), "equal"],
    commands: ggb.commands,
    coords: triangle.generateCoords(),
    options: ggb.getOptions(),
    answerFormat: "tex",
    identifiers: { square, sideLengths },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const temp = randint(2, 300);
    const squareRoot = new SquareRoot(temp);
    const wrongAnswer =
      Math.sqrt(temp) === Math.floor(Math.sqrt(temp))
        ? Math.sqrt(temp).toString()
        : squareRoot.toTree().toTex();
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { square }) => {
  const sqrt = Math.sqrt(square);
  const answer = isInt(sqrt)
    ? new NumberNode(sqrt)
    : new SqrtNode(new NumberNode(square), { allowSimplifySqrt: true });
  const texs = answer.toAllValidTexs();
  console.log(texs);
  return texs.includes(ans);
};

export const pythagoreCalcul: MathExercise<Identifiers> = {
  id: "pythagoreCalcul",
  connector: "=",
  label: "Utiliser le théoreme de Pythagore pour faire des calculs",
  levels: ["4ème", "3ème", "2nde"],
  isSingleStep: false,
  sections: ["Théorème de Pythagore", "Géométrie euclidienne"],
  generator: (nb: number) => getDistinctQuestions(getPythagoreCalcul, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  hasGeogebra: true,
};
