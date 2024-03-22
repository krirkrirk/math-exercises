import {
  shuffleProps,
  Exercise,
  Proposition,
  Question,
  tryToAddWrongProp,
  QuestionGenerator,
  QCMGenerator,
  addValidProp,
  VEA,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
import { v4 } from "uuid";
type Identifiers = {
  type: number;
  reds: number;
  greens: number;
  blacks: number;
};

const getBallsCountingQuestion: QuestionGenerator<Identifiers> = () => {
  const type = randint(0, 6);
  let instruction = "";
  let answer = "";
  const blacks = randint(2, 6);
  const greens = randint(2, 6);
  const reds = randint(3, 6);
  const total = blacks + greens + reds;
  switch (type) {
    case 0:
      instruction = ``;
      answer = total * (total - 1) * (total - 2) + "";
      break;
    case 1:
      instruction = `comportant trois boules rouges`;
      answer = reds * (reds - 1) * (reds - 2) + "";
      break;
    case 2:
      instruction = `ne comportant pas de boule noire`;
      answer = (reds + greens) * (reds + greens - 1) * (reds + greens - 2) + "";
      break;
    case 3:
      instruction = `comportant au moins une boule noire`;
      answer =
        total * (total - 1) * (total - 2) -
        (reds + greens) * (reds + greens - 1) * (reds + greens - 2) +
        "";
      break;
    case 4:
      instruction = `comportant trois boules de trois couleurs différentes`;
      answer = 6 * (blacks * greens * reds) + "";
      break;
    case 5:
      instruction = `comportant exactement une boule verte et deux boules noires`;
      answer = 6 * (greens * blacks * (blacks - 1)) + "";
      break;
    case 6:
      instruction = `comportant exactement une boule verte`;
      answer = 6 * greens * (reds + blacks) * (reds + blacks - 1) + "";
  }

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Une urne contient ${blacks} boules noires numérotées de 1 à ${blacks}, ${reds} boules rouges numérotées de 1 à ${reds} et ${greens} boules vertes numérotées de 1 à ${greens}.
    On tire successivement et sans remise 3 boules dans l'urne. 
    Combien de tirages ${instruction} sont possibles ?`,
    keys: [],
    answerFormat: "tex",
    identifiers: { type, reds, greens, blacks },
  };

  return question;
};
const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, type, reds, greens, blacks },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const total = reds + greens + blacks;
  switch (type) {
    case 0:
      tryToAddWrongProp(propositions, total * total * total + "");
      tryToAddWrongProp(propositions, 6 + "");
      break;
    case 1:
      tryToAddWrongProp(propositions, reds * reds * reds + "");
      tryToAddWrongProp(propositions, 1 + "");
      break;
    case 2:
      tryToAddWrongProp(
        propositions,
        (reds + greens) * (reds + greens) * (reds + greens) + "",
      );
      tryToAddWrongProp(
        propositions,
        6 * blacks * (reds + greens) * (reds + greens - 1) + "",
      );
      break;
    case 3:
      tryToAddWrongProp(
        propositions,
        (reds + greens) * (reds + greens) * (reds + greens) + "",
      );
      tryToAddWrongProp(
        propositions,
        3 * (reds + greens) * (reds + greens - 1) + "",
      );
      break;
    case 4:
      tryToAddWrongProp(propositions, blacks * greens * reds + "");
      tryToAddWrongProp(propositions, 6 + "");
      break;
    case 5:
      tryToAddWrongProp(propositions, 6 * greens * blacks * blacks + "");
      tryToAddWrongProp(propositions, 6 + "");
      break;
    case 6:
      tryToAddWrongProp(propositions, 6 * (blacks * greens * reds) + "");
      tryToAddWrongProp(
        propositions,
        greens * (reds + blacks) * (reds + blacks - 1) + "",
      );
      break;
  }
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(1, 100) + "");
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const ballsCounting: Exercise<Identifiers> = {
  id: "ballsCounting",
  connector: "=",
  label: "Dénombrement avec des boules",
  levels: ["TermSpé"],
  isSingleStep: true,
  sections: ["Combinatoire et dénombrement"],
  generator: (nb: number) => getDistinctQuestions(getBallsCountingQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
