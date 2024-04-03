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
import { round, roundSignificant } from "#root/math/utils/round";
import { Measure } from "#root/pc/measure/measure";
import { coinFlip } from "#root/utils/coinFlip";
import { doWhile } from "#root/utils/doWhile";

type Identifiers = {
  p1: number;
  v1: number;
  p2: number | undefined;
  v2: number | undefined;
  isAskingPressure: boolean;
};

const getMariotteQuestion: QuestionGenerator<Identifiers> = () => {
  const isAskingPressure = coinFlip();
  const v1 = randfloat(2, 10, 1);
  const p1 = new Measure(randfloat(1, 10, 1), 5);
  const v2 = isAskingPressure ? randfloat(2, 10, 1, [v1]) : undefined;
  const p2 = isAskingPressure
    ? undefined
    : doWhile(
        () => new Measure(randfloat(1, 10, 1), 5),
        (m) => m.equals(p1),
      );
  const answer = isAskingPressure
    ? p1
        .times(v1 / v2!)
        .toSignificant(1)
        .toTex({ scientific: 1 })
    : roundSignificant(p1.divide(p2!).times(v1).evaluate(), 1);

  const question: Question<Identifiers> = {
    answer,
    instruction: `Un volume d'air $V_1 = ${roundSignificant(
      v1,
      1,
    )}\\ \\text{L}$ contenu dans une bouteille hermétique est à la pression $P_1 = ${p1.toTex()}\\ \\text{Pa}$. En considérant que la température reste constante, calculer ${
      isAskingPressure ? "la pression $P_2$" : "le volume $V_2$"
    } de cet air lorsque ${
      isAskingPressure
        ? `le volume est $V_2 = ${roundSignificant(v2!, 1)}\\ \\text{L}$`
        : `la pression est $P_2 = ${p2?.toTex()}\\ \\text{Pa}$`
    }.`,
    keys: ["timesTenPower"],
    answerFormat: "tex",
    identifiers: {
      v1,
      p1: p1.significantPart,
      v2,
      p2: p2?.significantPart,
      isAskingPressure,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, isAskingPressure },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    if (isAskingPressure) {
      tryToAddWrongProp(
        propositions,
        new Measure(randfloat(1, 10, 1), 5)
          .toSignificant(1)
          .toTex({ scientific: 1 }),
      );
    } else {
      tryToAddWrongProp(propositions, roundSignificant(randfloat(0, 10, 1), 1));
    }
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const mariotte: Exercise<Identifiers> = {
  id: "mariotte",
  connector: "=",
  label: "Utiliser la loi de Mariotte",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Fluides"],
  generator: (nb: number) => getDistinctQuestions(getMariotteQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
};
