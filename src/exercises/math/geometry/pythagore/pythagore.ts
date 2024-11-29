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
  TriangleConstructor,
  TriangleIdentifiers,
} from "#root/math/geometry/triangle";
import { randint } from "#root/math/utils/random/randint";
import { LengthNode } from "#root/tree/nodes/geometry/lengthNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { SquareNode } from "#root/tree/nodes/operators/powerNode";
import { KeyId } from "#root/types/keyIds";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";

type Identifiers = {
  sideA: string;
  sideB: string;
  sideC: string;
  triangleIdentifiers: TriangleIdentifiers;
};

const getPythagore: QuestionGenerator<Identifiers> = () => {
  const vertices: KeyId[] = [];
  const code = 65 + randint(0, 24); // Générer un code de caractère majuscule aléatoire (A-Z)
  for (let i = 0; i < 3; i++)
    vertices.push(String.fromCharCode(code + i) as KeyId);

  const triangle = TriangleConstructor.createRandomRightTriangle({
    minRapport: 0.7,
    maxRapport: 1.3,
    names: vertices,
  });
  const sideA = triangle.getSideAName();
  const sideB = triangle.getSideBName();
  const sideC = triangle.getSideCName();
  const triangleIdentifiers = triangle.toIdentifiers();
  const ggb = new GeogebraConstructor({
    commands: triangle.generateCommands({}),
    hideAxes: true,
    hideGrid: true,
  });
  const answer = `${sideA}^2=${sideB}^2+${sideC}^2`;
  const question: Question<Identifiers> = {
    instruction:
      "Écrire l'égalité de Pythagore pour le triangle rectangle suivant : ",

    answer,
    keys: [...vertices, "equal"],
    ggbOptions: ggb.getOptions({
      coords: triangle.generateCoords(),
    }),
    answerFormat: "tex",
    identifiers: { sideA, sideB, sideC, triangleIdentifiers },
  };

  return question;
};
const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, sideA, sideB, sideC },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, `${sideA} = ${sideB} + ${sideC}`);
  tryToAddWrongProp(propositions, `${sideA}^2 = ${sideB}^2 - ${sideC}^2`);
  tryToAddWrongProp(propositions, `${sideB}^2 = ${sideA}^2 + ${sideC}^2`);
  tryToAddWrongProp(propositions, `${sideC}^2 = ${sideA}^2 + ${sideB}^2`);
  tryToAddWrongProp(propositions, `${sideA}^2 = ${sideB} + ${sideC}^2`);
  tryToAddWrongProp(propositions, `${sideA}^2 = ${sideB}^2 + ${sideC}`);

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { sideA, sideB, sideC }) => {
  const answer = new EqualNode(
    new SquareNode(new LengthNode(sideA)),
    new AddNode(
      new SquareNode(new LengthNode(sideB)),
      new SquareNode(new LengthNode(sideC)),
    ),
  );
  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};
export const pythagore: Exercise<Identifiers> = {
  id: "pythagore",
  connector: "=",
  label: "Écrire l'égalité de Pythagore",
  levels: ["4ème", "3ème", "2nde"],
  isSingleStep: false,
  sections: ["Théorème de Pythagore", "Géométrie euclidienne"],
  generator: (nb: number) => getDistinctQuestions(getPythagore, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  hasGeogebra: true,
  subject: "Mathématiques",
};
