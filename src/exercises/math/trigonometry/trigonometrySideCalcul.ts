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
import { round } from "#root/math/utils/round";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { KeyId } from "#root/types/keyIds";
import { shuffle } from "#root/utils/shuffle";
type Identifiers = {
  sideLengths: number[];
  randAngle: number;
  randSide: number;
  randSideQuestion: number;
};

const getTrigonometrySideCalcul: QuestionGenerator<Identifiers> = () => {
  const vertices = [];
  const code = 65 + randint(0, 24); // Générer un code de caractère majuscule aléatoire (A-Z)
  for (let i = 0; i < 3; i++) vertices.push(String.fromCharCode(code + i));

  const triangle = TriangleConstructor.createRandomRightTriangle({
    minRapport: 0.5,
    maxRapport: 1.5,
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
  ].map((el) => round(el / 2, 2));

  const angle = [triangle.vertexB.name, triangle.vertexC.name];

  const randAngle = randint(0, 2);
  const randSide = randint(0, 3); // valeurs possible : 0 1 2
  const randSideQuestion = randint(0, 3, [randSide]); // si rand = 0, valeurs possible 1 2

  const angleValue = [
    round((Math.acos(sideLengths[0] / sideLengths[2]) * 180) / Math.PI, 1),
    round((Math.acos(sideLengths[1] / sideLengths[2]) * 180) / Math.PI, 1),
  ];

  const commands = [
    ...triangle.generateCommands({
      highlightedAngle: angle[randAngle],
      colorHighlightedAngle: "Black",
      showLabels: [sides[randSideQuestion]],
      setCaptions: ["?"],
      highlightedSide: sides[randSideQuestion],
    }),
  ];
  const ggb = new GeogebraConstructor(commands, {
    hideAxes: true,
    hideGrid: true,
  });
  const answer = `${(round(sideLengths[randSideQuestion], 1) + "").replace(
    ".",
    ",",
  )}`;
  const question: Question<Identifiers> = {
    instruction: `Le triangle $${triangle.getTriangleName()}$ rectangle en $${triangle.getRightAngle()}$ est tel que $${
      sides[randSide]
    } = ${(sideLengths[randSide] + "").replace(".", ",")}$ cm et $\\widehat{${
      angle[randAngle]
    }} = ${(angleValue[randAngle] + "").replace(".", ",")}^\\circ$. Calculer $${
      sides[randSideQuestion]
    }$ à $0,1$ cm près.`,
    answer,
    hint: getHint(sides, angle[randAngle]),
    correction: getCorrection(
      sides,
      sideLengths,
      randSideQuestion,
      randSide,
      angle[randAngle],
      angleValue[randAngle],
      answer,
    ),
    keys: [],
    commands: ggb.commands,
    options: ggb.getOptions(),
    coords: triangle.generateCoords(),
    answerFormat: "tex",
    identifiers: { randAngle, randSide, randSideQuestion, sideLengths },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      `${(round(randint(11, 100) / 10, 1) + "").replace(".", ",")}`,
    );
  }

  return shuffle(propositions);
};
const getHint = (sides: string[], angle: string): string => {
  const hypothenus = sides[2];
  const adjacent = sides.filter(
    (value) =>
      value !== hypothenus &&
      [value.charAt(0), value.charAt(1)].includes(angle),
  )[0];
  const opposite = sides.filter(
    (value) => value !== hypothenus && value !== adjacent[0],
  )[0];

  return `Identifier le côté opposé, le côté adjacent et l'hypoténuse, puis utiliesr la bonne formule de trigonométrie.`;
};

const getCorrection = (
  sides: string[],
  sideLengths: number[],
  randSideQuestion: number,
  randSide: number,
  angle: string,
  angleValue: number,
  answer: string,
) => {
  const hypothenus = { name: sides[2], length: sideLengths[2] };
  const sidesWithLentgh = sides.map((value, index) => {
    return { name: value, length: sideLengths[index] };
  });
  const adjacent = sidesWithLentgh.filter(
    (value) =>
      value.name !== hypothenus.name &&
      [value.name.charAt(0), value.name.charAt(1)].includes(angle),
  )[0];
  const opposite = sidesWithLentgh.filter(
    (value) => value.name !== hypothenus.name && value.name !== adjacent.name,
  )[0];

  const correctEquations = getCorrectEquations(
    { name: sides[randSideQuestion], length: sideLengths[randSideQuestion] },
    { name: sides[randSide], length: sideLengths[randSide] },
    hypothenus,
    { name: angle, value: angleValue },
    adjacent,
    opposite,
    answer,
  );

  return `On utilise la relation $${correctEquations[0]}$, on a donc :
    $${correctEquations[1]} \\Leftrightarrow ${correctEquations[2]} \\Leftrightarrow ${correctEquations[3]}$ `;
};

const getCorrectEquations = (
  randSideQuestion: { name: string; length: number },
  randSide: { name: string; length: number },
  hypothenus: { name: string; length: number },
  angle: { name: string; value: number },
  adjacent: { name: string; length: number },
  opposite: { name: string; length: number },
  answer: string,
): string[] => {
  let result;
  switch (randSideQuestion.name) {
    case adjacent.name:
      result =
        randSide.name === opposite.name
          ? [
              `\\tan(\\widehat{${angle.name}})=\\frac{${opposite.name}}{${adjacent.name}}`,
              `\\tan(\\widehat{${angle.value}})=\\frac{${opposite.length}}{${adjacent.name}}`,
              `\\frac{${opposite.length}}{\\tan(\\widehat{${angle.value}})}=${adjacent.name}`,
            ]
          : [
              `\\cos(\\widehat{${angle.name}})=\\frac{${adjacent.name}}{${hypothenus.name}}`,
              `\\cos(\\widehat{${angle.value}})=\\frac{${adjacent.name}}{${hypothenus.length}}`,
              `\\cos(\\widehat{${angle.value}})*${hypothenus.length}=${adjacent.name}`,
            ];
      return result.concat(`${answer}=${adjacent.name}`);
    case opposite.name:
      result =
        randSide.name === adjacent.name
          ? [
              `\\tan(\\widehat{${angle.name}})=\\frac{${opposite.name}}{${adjacent.name}}`,
              `\\tan(\\widehat{${angle.value}})=\\frac{${opposite.name}}{${adjacent.length}}`,
              `\\tan(\\widehat{${angle.value}})*${adjacent.length}=${opposite.name}`,
            ]
          : [
              `\\sin(\\widehat{${angle.name}})=\\frac{${opposite.name}}{${hypothenus.name}}`,
              `\\sin(\\widehat{${angle.value}})=\\frac{${opposite.name}}{${hypothenus.length}}`,
              `\\sin(\\widehat{${angle.value}})*${hypothenus.length}=${opposite.name}`,
            ];
      return result.concat(`${answer}=${opposite.name}`);
    case hypothenus.name:
      result =
        randSide.name === adjacent.name
          ? [
              `\\cos(\\widehat{${angle.name}})=\\frac{${adjacent.name}}{${hypothenus.name}}`,
              `\\cos(\\widehat{${angle.value}})=\\frac{${adjacent.length}}{${hypothenus.name}}`,
              `\\frac{${adjacent.length}}{\\cos(${angle.value})}=${hypothenus.name}`,
            ]
          : [
              `\\sin(\\widehat{${angle.name}})=\\frac{${opposite.name}}{${hypothenus.name}}`,
              `\\sin(\\widehat{${angle.value}})=\\frac{${opposite.length}}{${hypothenus.name}}`,
              `\\frac{${opposite.length}}{\\sin(${angle.value})}=${hypothenus.name}`,
            ];
      return result.concat(`${answer}=${hypothenus.name}`);
    default:
      return [];
  }
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  const answerTree = new NumberNode(Number(answer.replace(",", ".")));
  const texs = answerTree.toAllValidTexs();
  return texs.includes(ans);
};

export const trigonometrySideCalcul: Exercise<Identifiers> = {
  id: "trigonometrySideCalcul",
  connector: "=",
  label: "Utiliser la trigonométrie pour calculer un côté",
  levels: ["4ème", "3ème", "2nde"],
  isSingleStep: false,
  sections: ["Trigonométrie", "Géométrie euclidienne"],
  generator: (nb: number) =>
    getDistinctQuestions(getTrigonometrySideCalcul, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  hasGeogebra: true,
  subject: "Mathématiques",
};
