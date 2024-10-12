import {
  Exercise,
  Question,
  Proposition,
  QCMGenerator,
  addValidProp,
  tryToAddWrongProp,
  QuestionGenerator,
  VEA,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Vector } from "#root/math/geometry/vector";
import { distinctRandTupleInt } from "#root/math/utils/random/randTupleInt";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { shuffle } from "#root/utils/alea/shuffle";

type Identifiers = {
  uCoords: string[];
  vCoords: string[];
};

const getScalarProductViaCoordsQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const [coords1, coords2] = distinctRandTupleInt(2, 2, { from: -9, to: 10 });
  const u = new Vector(
    "u",
    new NumberNode(coords1[0]),
    new NumberNode(coords1[1]),
  );
  const v = new Vector(
    "v",
    new NumberNode(coords2[0]),
    new NumberNode(coords2[1]),
  );

  const answer = u.scalarProduct(v).toTex();
  const question: Question<Identifiers> = {
    instruction: `Soit $${u.toTexWithCoords()}$ et $${v.toTexWithCoords()}$. Calculer $${u.toTex()}\\cdot ${v.toTex()}$.`,
    startStatement: `${u.toTex()}\\cdot ${v.toTex()}`,
    answer: answer,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      uCoords: [u.x.toTex(), u.y.toTex()],
      vCoords: [v.x.toTex(), v.y.toTex()],
    },
    hint: "Le produit scalaire de deux vecteurs se calcule en multipliant les coordonnées correspondantes et en additionnant les résultats.",
    correction: `Le produit scalaire de $${u.toTex()}$ et $${v.toTex()}$ est calculé comme suit : 
    
$$
(${u.x.toTex()} \\times ${v.x.toTex()}) + (${u.y.toTex()} \\times ${v.y.toTex()}) = ${answer}
$$`,
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(-100, 100, [0]) + "");
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const scalarProductViaCoords: Exercise<Identifiers> = {
  id: "scalarProductViaCoords",
  connector: "=",
  isSingleStep: false,
  label: "Calculer un produit scalaire à l'aide des coordonnées",
  levels: ["1reSpé", "TermSpé"],
  sections: ["Vecteurs", "Produit scalaire"],
  generator: (nb: number) =>
    getDistinctQuestions(getScalarProductViaCoordsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
