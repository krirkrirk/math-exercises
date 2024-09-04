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
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { TriangleConstructor } from "#root/math/geometry/triangles";
import { randint } from "#root/math/utils/random/randint";
import { LengthNode } from "#root/tree/nodes/geometry/lengthNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { KeyId } from "#root/types/keyIds";
import { shuffle } from "#root/utils/shuffle";
import { v4 } from "uuid";

type Identifiers = {
  sideA: string;
  sideB: string;
  sideC: string;
  randAngle: number;
  randTrigo: number;
};

const getTrigonometry: QuestionGenerator<Identifiers> = () => {
  const vertices = [];
  const code = 65 + randint(0, 24); // Générer un code de caractère majuscule aléatoire (A-Z)
  for (let i = 0; i < 3; i++) vertices.push(String.fromCharCode(code + i));

  const triangle = TriangleConstructor.createRandomRightTriangle({
    minRapport: 0.7,
    maxRapport: 1.3,
    names: vertices,
  });

  const sideA = triangle.getSideAName();
  const sideB = triangle.getSideBName();
  const sideC = triangle.getSideCName();
  const trigo = ["le cosinus", "le sinus", "la tangente"];
  const randTrigo = randint(0, 3);

  const angle = [triangle.vertexB.name, triangle.vertexC.name];
  const randAngle = randint(0, 2);

  let quotient: string[];

  switch (randAngle) {
    case 0:
      quotient = [
        `\\frac{${sideC}}{${sideA}}`,
        `\\frac{${sideB}}{${sideA}}`,
        `\\frac{${sideB}}{${sideC}}`,
      ];
      break;
    case 1:
      quotient = [
        `\\frac{${sideB}}{${sideA}}`,
        `\\frac{${sideC}}{${sideA}}`,
        `\\frac{${sideC}}{${sideB}}`,
      ];
      break;
    default:
      quotient = [""];
  }
  const ggb = new GeogebraConstructor({
    commands: triangle.generateCommands({ highlightedAngle: angle[randAngle] }),
    hideAxes: true,
    hideGrid: true,
  });
  const answer = quotient[randTrigo];
  const question: Question<Identifiers> = {
    instruction: `À quel quotient est égal ${trigo[randTrigo]} de l'angle $\\widehat{${angle[randAngle]}}$?`,
    answer,
    keys: [...(vertices as KeyId[]), "equal"],
    ggbOptions: ggb.getOptions({
      coords: triangle.generateCoords(),
    }),
    answerFormat: "tex",
    identifiers: { sideA, sideB, sideC, randAngle, randTrigo },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, sideA, sideB, sideC },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const wrongQuotients = [
    `\\frac{${sideC}}{${sideA}}`,
    `\\frac{${sideB}}{${sideA}}`,
    `\\frac{${sideB}}{${sideC}}`,
    `\\frac{${sideB}}{${sideA}}`,
    `\\frac{${sideC}}{${sideA}}`,
    `\\frac{${sideC}}{${sideB}}`,
    `\\frac{${sideA}}{${sideC}}`,
    `\\frac{${sideA}}{${sideB}}`,
    `\\frac{${sideC}}{${sideB}}`,
    `\\frac{${sideA}}{${sideB}}`,
    `\\frac{${sideA}}{${sideC}}`,
    `\\frac{${sideB}}{${sideC}}`,
  ];
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, wrongQuotients[randint(0, 12)]);
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { randAngle, randTrigo, sideA, sideB, sideC },
) => {
  let quotients: string[][] = [];
  if (randAngle === 0)
    quotients = [
      [sideC, sideA],
      [sideB, sideA],
      [sideB, sideC],
    ];
  else
    quotients = [
      [sideB, sideA],
      [sideC, sideA],
      [sideC, sideB],
    ];
  const quotient = quotients[randTrigo];
  const answer = new FractionNode(
    new LengthNode(quotient[0]),
    new LengthNode(quotient[1]),
  );
  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};

export const trigonometry: Exercise<Identifiers> = {
  id: "trigonometry",
  connector: "=",
  label:
    "Écrire le quotient égal au cosinus, au sinus ou à la tangente d'un angle dans un triangle rectangle",
  levels: ["4ème", "3ème", "2nde"],
  isSingleStep: false,
  sections: ["Trigonométrie", "Géométrie euclidienne"],
  generator: (nb: number) => getDistinctQuestions(getTrigonometry, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  hasGeogebra: true,
  subject: "Mathématiques",
};
