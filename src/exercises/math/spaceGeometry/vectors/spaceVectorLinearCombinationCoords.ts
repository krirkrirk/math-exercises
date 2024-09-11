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
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { PointConstructor } from "#root/math/geometry/point";
import { SpacePointConstructor } from "#root/math/geometry/spacePoint";
import { SpaceVectorConstructor } from "#root/math/geometry/spaceVector";
import { randint } from "#root/math/utils/random/randint";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";

type Identifiers = {};

// coords de au + bv en 3D
const getSpaceVectorLinearCombinationCoordsQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const a = randint(-10, 11, [0]);
  const b = randint(-10, 11, [0]);
  const [u, v] = SpaceVectorConstructor.randomDifferents(["u", "v"], false);
  const answer = u
    .times(a.toTree())
    .add(v.times(b.toTree()))
    .toInlineCoordsTex();
  const question: Question<Identifiers> = {
    answer,
    instruction: `Soit deux vecteurs $${u.toTexWithCoords()}$ et $${v.toTexWithCoords()}$. Calculer les coordonnées du vecteur $${new AddNode(
      new MultiplyNode(a.toTree(), u.toTex().toTree()),
      new MultiplyNode(b.toTree(), v.toTex().toTree()),
    ).toTex()}$`,
    keys: ["semicolon"],
    answerFormat: "tex",
    identifiers: {
      a,
      b,
      ux: u.x.evaluate({}),
      uy: u.y.evaluate({}),
      uz: u.z.evaluate({}),
      vx: v.x.evaluate({}),
      vy: v.y.evaluate({}),
      vz: v.z.evaluate({}),
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      SpacePointConstructor.random(
        "A",
        { min: -100, max: 100 },
        { min: -100, max: 100 },
        { min: -100, max: 100 },
      ).toCoords(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return [ans, ans.replace(",", ";"), "\\left(" + ans + "\\right)"].includes(
    answer,
  );
};

export const spaceVectorLinearCombinationCoords: Exercise<Identifiers> = {
  id: "spaceVectorLinearCombinationCoords",
  connector: "=",
  label:
    "Calcul des coordonnées du vecteur $a\\overrightarrow{u} + b\\overrightarrow{v}$ (dans l'espace)",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getSpaceVectorLinearCombinationCoordsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
