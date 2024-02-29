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
import { Trinom, TrinomConstructor } from "#root/math/polynomials/trinom";
import { randint } from "#root/math/utils/random/randint";
import { PointNode } from "#root/tree/nodes/geometry/pointNode";
import { shuffle } from "#root/utils/shuffle";
type Identifiers = {
  a: number;
  b: number;
  c: number;
};

const getExtremumFromCanonicalFormQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const trinom = TrinomConstructor.randomCanonical();
  const answer = trinom.getSommet().toTexWithCoords();

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Soit $f$ la fonction définie par $${trinom
      .getCanonicalForm()
      .toTex()}$. Quelles sont les coordonnées du sommet $S$ de la parabole représentative de $f$ ?`,
    keys: ["S", "semicolon"],
    answerFormat: "tex",
    identifiers: { a: trinom.a, b: trinom.b, c: trinom.c },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a, b, c }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const trinom = new Trinom(a, b, c);
  const alpha = trinom.getAlpha();
  const beta = trinom.getBeta();
  tryToAddWrongProp(propositions, `S\\left(${beta};${alpha}\\right)`);
  tryToAddWrongProp(propositions, `S\\left(${-alpha};${beta}\\right)`);
  tryToAddWrongProp(propositions, `S\\left(${alpha};${-beta}\\right)`);

  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      `S\\left(${randint(-10, 11)};${randint(-10, 11)}\\right)`,
    );
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, b, c }) => {
  const trinom = new Trinom(a, b, c);
  const sommet = trinom.getSommet();
  const answer = new PointNode(sommet);
  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};

export const extremumFromCanonicalForm: MathExercise<Identifiers> = {
  id: "extremumFromCanonicalForm",
  connector: "=",
  label:
    "Déterminer les coordonnées du sommet d'une parabole à partir de la forme canonique",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Second degré"],
  generator: (nb: number) =>
    getDistinctQuestions(getExtremumFromCanonicalFormQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
