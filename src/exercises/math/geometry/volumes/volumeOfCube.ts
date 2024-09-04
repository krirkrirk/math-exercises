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
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { randint } from "#root/math/utils/random/randint";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";

type Identifiers = {
  cubeSide: number;
};

const getVolumeOfCubeQuestion: QuestionGenerator<Identifiers> = () => {
  const cubeSide = randint(1, 21);

  const commands = [
    `A=Point({0,0,0})`,
    `B=Point({0,0,${cubeSide}})`,
    `C=Point({${cubeSide},0,${cubeSide}})`,
    `ShowLabel(A,true)`,
    `ShowLabel(B,true)`,
    `ShowLabel(C,true)`,
    `P=Cube(A,B,C)`,
  ];
  const ggb = new GeogebraConstructor({
    commands,
    is3D: true,
    hideAxes: true,
    hideGrid: true,
  });

  const question: Question<Identifiers> = {
    answer: Math.pow(cubeSide, 3) + "",
    instruction: `$ABCDEFGH$ est un cube d'arête $${cubeSide}$. Calculer son volume.`,
    keys: [],
    answerFormat: "tex",
    ggbOptions: ggb.getOptions({
      coords: [0, cubeSide + 1, 0, cubeSide + 1, 0, cubeSide + 1],
    }),
    identifiers: { cubeSide },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, cubeSide },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  generatePropositions(cubeSide).forEach((value) =>
    tryToAddWrongProp(propositions, value),
  );
  const correctAns = Math.pow(cubeSide, 3);
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      randint(correctAns - 10, correctAns + 10, [correctAns]) + "",
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, cubeSide }) => {
  const powerNode = new PowerNode(cubeSide.toTree(), (3).toTree());
  return [answer, ...powerNode.toAllValidTexs()].includes(ans);
};

const generatePropositions = (cubeSide: number): string[] => {
  const firstProposition = Math.pow(cubeSide, 2) * 6;
  const secondProposition = Math.pow(cubeSide, 2);

  return [firstProposition + "", secondProposition + ""];
};
export const volumeOfCube: Exercise<Identifiers> = {
  id: "volumeOfCube",
  label: "Calculer le volume d'un cube",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Géométrie euclidienne"],
  generator: (nb: number) =>
    getDistinctQuestions(getVolumeOfCubeQuestion, nb, 15),
  maxAllowedQuestions: 15,
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  hasGeogebra: true,
  subject: "Mathématiques",
};
