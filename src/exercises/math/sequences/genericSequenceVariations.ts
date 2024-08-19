import {
  shuffleProps,
  Exercise,
  Proposition,
  Question,
  tryToAddWrongProp,
  QuestionGenerator,
  addValidProp,
  QCMGenerator,
  VEA,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Rational } from "#root/math/numbers/rationals/rational";
import { PolynomialConstructor } from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import { v4 } from "uuid";

type Identifiers = {
  coeffs: number[];
};

const getGenericSequenceVariationsQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const u = PolynomialConstructor.randomWithOrder(2, "n");
  const [b, a] = u.coefficients.slice(1);
  const root = Math.ceil((-a - b) / (2 * a));
  const answer =
    root <= 0
      ? a > 0
        ? "Croissante"
        : "Décroissante"
      : `${a > 0 ? "Croissante" : "Décroissante"} à partir du rang ${root}`;

  const question: Question<Identifiers> = {
    answer,
    instruction: `Soit $u$ la suite définie par $u_n = ${u
      .toTree()
      .toTex()}$. Quel est le sens de variations de $u$ ?`,
    keys: [],
    answerFormat: "raw",
    identifiers: { coeffs: u.coefficients },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, coeffs }) => {
  const [b, a] = coeffs.slice(1);
  const root = Math.ceil((-a - b) / (2 * a));
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");

  tryToAddWrongProp(propositions, "Croissante", "raw");
  tryToAddWrongProp(propositions, "Décroissante", "raw");
  let fakeRoot = root <= 0 ? randint(1, 10) : root;
  tryToAddWrongProp(
    propositions,
    `Croissante à partir du rang ${fakeRoot}`,
    "raw",
  );
  tryToAddWrongProp(
    propositions,
    `Décroissante à partir du rang ${fakeRoot}`,
    "raw",
  );

  return shuffleProps(propositions, n);
};

export const genericSequenceVariations: Exercise<Identifiers> = {
  id: "genericSequenceVariations",
  connector: "=",
  label:
    "Déterminer le sens de variations d'une suite en étudiant la différence de deux termes",
  levels: ["1reESM", "1rePro", "1reTech"],
  isSingleStep: true,
  sections: ["Suites"],
  generator: (nb: number) =>
    getDistinctQuestions(getGenericSequenceVariationsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  answerType: "QCU",
  getPropositions,
  subject: "Mathématiques",
};
