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
import { randfloat } from "#root/math/utils/random/randfloat";
import { Measure } from "#root/pc/measure/measure";
import { random } from "#root/utils/random";

type Identifiers = {
  varAsked: string;
  F: { significantPart: number; exponent: number };
  P: { significantPart: number; exponent: number };
  S: { significantPart: number; exponent: number };
};

const getPressingForceQuestion: QuestionGenerator<Identifiers> = () => {
  let F: Measure;
  let S: Measure;
  let P: Measure;
  const varAsked = random(["F", "S", "P"]);
  let FInstruction = "F";
  let PInstruction = "P";
  let SInstruction = "S";
  let answer = "";
  let unit = "";
  switch (varAsked) {
    case "F":
      P = new Measure(randfloat(1, 8, 1), 5);
      PInstruction = `P=${P.toTex({ scientific: 1 })}\\ \\text{Pa}`;

      S = new Measure(randfloat(1, 8, 1), 2);
      SInstruction = `S=${S.toTex({ scientific: 1 })}\\ \\text{m}^2`;

      F = P.times(S);
      answer = F.toSignificant(1).toTex({ scientific: 1 });
      unit = "$\\text{N}$";
      break;
    case "S":
      P = new Measure(randfloat(1, 8, 1), 5);
      PInstruction = `P=${P.toTex({ scientific: 1 })}\\ \\text{Pa}`;

      F = new Measure(randfloat(1, 8, 1), 7);
      FInstruction = `F=${F.toTex({ scientific: 1 })}\\ \\text{N}`;

      S = F.divide(P);
      answer = S.toSignificant(1).toTex({ scientific: 1 });
      unit = "$\\text{m}^2$";

      break;
    case "P":
    default:
      S = new Measure(randfloat(1, 8, 1), 2);
      SInstruction = `S=${S.toTex({ scientific: 1 })}\\ \\text{m}^2`;

      F = new Measure(randfloat(1, 8, 1), 7);
      FInstruction = `F=${F.toTex({ scientific: 1 })}\\ \\text{N}`;

      P = F.divide(S);
      answer = P.toSignificant(1).toTex({ scientific: 1 });
      unit = "$\\text{Pa}$";

      break;
  }
  const question: Question<Identifiers> = {
    answer,
    instruction: `Un fluide de pression $${PInstruction}$ exerce une force de valeur $${FInstruction}$ sur une paroi de surface $${SInstruction}$. Calculer $${varAsked}$ (en ${unit}).`,
    keys: ["timesTenPower"],
    answerFormat: "tex",
    identifiers: {
      F: F.toIdentifiers(),
      P: P.toIdentifiers(),
      S: S.toIdentifiers(),
      varAsked,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, varAsked },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    switch (varAsked) {
      case "F":
        tryToAddWrongProp(
          propositions,
          new Measure(randfloat(1, 10, 1), 7).toTex({ scientific: 1 }),
        );

        break;
      case "S":
        tryToAddWrongProp(
          propositions,
          new Measure(randfloat(1, 10, 1), 2).toTex({ scientific: 1 }),
        );

        break;

      case "P":
        tryToAddWrongProp(
          propositions,
          new Measure(randfloat(1, 10, 1), 5).toTex({ scientific: 1 }),
        );
        break;
    }
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const pressingForce: Exercise<Identifiers> = {
  id: "pressingForce",
  connector: "=",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) => getDistinctQuestions(getPressingForceQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
