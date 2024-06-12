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
import { Vector, VectorConstructor } from "#root/math/geometry/vector";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { coinFlip } from "#root/utils/coinFlip";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  xu: number;
  yu: number;
  xv: number;
  yv: number;
};

const getColinearityQuestion: QuestionGenerator<Identifiers> = () => {
  const u = VectorConstructor.random("u", false);
  const isColinear = coinFlip();
  let v: Vector;
  if (isColinear) {
    const coeff = new NumberNode(randint(-5, 5));
    v = u.times(coeff, "v");
  } else {
    do {
      v = VectorConstructor.random("v", false);
    } while (u.isColinear(v));
  }
  // const isColinear = u.isColinear(v);
  const answer = isColinear ? "Oui" : "Non";
  const question: Question<Identifiers> = {
    answer,
    instruction: `Soit deux vecteurs $${u.toTexWithCoords()}$ et $${v.toTexWithCoords()}$. $${u.toTex()}$ et $${v.toTex()}$ sont-ils colinéaires ?`,
    keys: [],
    answerFormat: "raw",
    identifiers: {
      xu: u.x.evaluate({}),
      xv: v.x.evaluate({}),
      yu: u.y.evaluate({}),
      yv: v.y.evaluate({}),
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");
  tryToAddWrongProp(propositions, "Oui", "raw");
  tryToAddWrongProp(propositions, "Non", "raw");
  tryToAddWrongProp(propositions, "On ne peut pas savoir", "raw");
  return shuffle(propositions);
};

export const colinearity: Exercise<Identifiers> = {
  id: "colinearity",
  label: "Déterminer si deux vecteurs sont colinéaires",
  levels: ["2nde", "1reSpé"],
  isSingleStep: true,
  sections: ["Vecteurs"],
  generator: (nb: number) => getDistinctQuestions(getColinearityQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  answerType: "QCM",
  subject: "Mathématiques",
};
