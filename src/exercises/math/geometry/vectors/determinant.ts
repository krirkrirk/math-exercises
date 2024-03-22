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
import { Vector, VectorConstructor } from "#root/math/geometry/vector";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  uCoords: string[];
  vCoords: string[];
};

const getDeterminantQuestion: QuestionGenerator<Identifiers> = () => {
  const u = VectorConstructor.random("u");
  const v = VectorConstructor.random("v");
  const answer = u.determinant(v);
  const answerTex = answer.toTex();
  const question: Question<Identifiers> = {
    answer: answerTex,
    instruction: `Soient les vecteurs $${u.toTexWithCoords()}$ et $${v.toTexWithCoords()}$. Calculer le déterminant $\\det(\\overrightarrow u;\\overrightarrow v)$.`,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      uCoords: [u.x.toTex(), u.y.toTex()],
      vCoords: [v.x.toTex(), v.y.toTex()],
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, uCoords, vCoords },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const u = new Vector(
    "u",
    new NumberNode(Number(uCoords[0])),
    new NumberNode(Number(uCoords[1])),
  );
  const v = new Vector(
    "v",
    new NumberNode(Number(vCoords[0])),
    new NumberNode(Number(vCoords[1])),
  );

  tryToAddWrongProp(propositions, u.scalarProduct(v).toTex());

  while (propositions.length < n) {
    const wrongAnswer = randint(-20, 20) + "";
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const determinant: Exercise<Identifiers> = {
  id: "determinant",
  connector: "=",
  label: "Calculer le déterminant de deux vecteurs",
  levels: ["2nde", "1reESM", "1reSpé"],
  isSingleStep: true,
  sections: ["Vecteurs"],
  generator: (nb: number) => getDistinctQuestions(getDeterminantQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
