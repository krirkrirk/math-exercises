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
import { SpacePointConstructor } from "#root/math/geometry/spacePoint";
import {
  SpaceVector,
  SpaceVectorConstructor,
} from "#root/math/geometry/spaceVector";

type Identifiers = {};

const getSpaceVectorCoordinatesFromPointsQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const points = SpacePointConstructor.randomDifferent(["A", "B"]);
  const vector = SpaceVectorConstructor.fromPoints(points[0], points[1]);
  const answer = vector.toInlineCoordsTex();
  const question: Question<Identifiers> = {
    answer,
    instruction: `Soit deux points $${points[0].toTexWithCoords()}$ et $${points[1].toTexWithCoords()}$. Quelles sont les coordonnées du vecteur $\\overrightarrow{AB}$ ?`,
    keys: ["semicolon"],
    answerFormat: "tex",
    identifiers: {
      ax: points[0].x.evaluate({}),
      ay: points[0].y.evaluate({}),
      az: points[0].z.evaluate({}),

      bx: points[1].x.evaluate({}),
      by: points[1].y.evaluate({}),
      bz: points[1].z.evaluate({}),
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
      SpacePointConstructor.random("C").toCoords(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return [ans, ans.replace(",", ";"), "\\left(" + ans + "\\right)"].includes(
    answer,
  );
};

export const spaceVectorCoordinatesFromPoints: Exercise<Identifiers> = {
  id: "spaceVectorCoordinatesFromPoints",
  connector: "=",
  label:
    "Déterminer les coordonnées d'un vecteur à partir de deux points (dans l'espace)",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getSpaceVectorCoordinatesFromPointsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
