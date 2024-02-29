import {
  shuffleProps,
  MathExercise,
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
  face1?: number;
  face2?: number;
  face3?: number;
};

const getDiceCountingQuestion: QuestionGenerator<Identifiers> = () => {
  const type = randint(0, 8);
  let instruction = "";
  let answer = "";
  let face1: number | undefined;
  let face2: number | undefined;
  let face3: number | undefined;
  switch (type) {
    case 0:
      instruction = `avec exactement deux chiffres identiques`;
      answer = 6 * 3 * 5 + "";
      break;
    case 1:
      instruction = `avec trois chiffres identiques`;
      answer = 6 + "";
      break;
    case 2:
      face1 = randint(1, 7);
      instruction = `avec exactement une fois la face ${face1}`;
      answer = 3 * 5 * 5 + "";
      break;
    case 3:
      face1 = randint(1, 7);
      instruction = `avec exactement deux fois la face ${face1}`;
      answer = 3 * 5 + "";
      break;
    case 4:
      face1 = randint(1, 7);
      face2 = randint(1, 7, [face1]);
      face3 = randint(1, 7, [face1, face2]);
      instruction = `avec exactement les faces ${face1}, ${face2} et ${face3}`;
      answer = 6 + "";
      break;
    case 5:
      face1 = randint(1, 7);
      face2 = randint(1, 7, [face1]);
      face3 = randint(1, 7, [face1, face2]);
      instruction = `avec exactement une fois la face ${face1} et une fois la face ${face2}`;
      answer = 3 * 5 + "";
      break;
    case 6:
      instruction = `dans lesquels toutes les faces sont différentes`;
      answer = 6 * 5 * 4 + "";
      break;
    case 7:
      instruction = "";
      answer = 6 * 6 * 6 + "";
      break;
  }

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `On tire 3 fois consécutivement un dé à six faces numérotées de 1 à 6. Combien de tirages ${instruction} sont possibles ?`,
    keys: [],
    answerFormat: "tex",
    identifiers: { type, face1, face2, face3 },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, type }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  switch (type) {
    case 0:
      tryToAddWrongProp(propositions, 3 * 5 + "");
      tryToAddWrongProp(propositions, 6 * 6 * 3 + "");
      tryToAddWrongProp(propositions, 6 * 3 + "");
      break;
    case 1:
      tryToAddWrongProp(propositions, 6 * 3 + "");
      tryToAddWrongProp(propositions, 1 + "");
      break;
    case 2:
      tryToAddWrongProp(propositions, 3 * 6 * 6 + "");
      tryToAddWrongProp(propositions, 6 + "");
      tryToAddWrongProp(propositions, 5 * 5 + "");
      break;
    case 3:
      tryToAddWrongProp(propositions, 6 * 3 + "");
      tryToAddWrongProp(propositions, 6 * 5 + "");
      tryToAddWrongProp(propositions, 5 + "");
      break;
    case 4:
      tryToAddWrongProp(propositions, 3 + "");
      tryToAddWrongProp(propositions, 1 + "");
      tryToAddWrongProp(propositions, 6 * 6 * 6 + "");
      break;
    case 5:
      tryToAddWrongProp(propositions, 6 * 3 + "");
      tryToAddWrongProp(propositions, 6 * 5 + "");
      tryToAddWrongProp(propositions, 5 + "");
      break;
    case 6:
      tryToAddWrongProp(propositions, 6 * 6 * 6 + "");
      tryToAddWrongProp(propositions, 6 * 5 + "");
      tryToAddWrongProp(propositions, 6 + "");
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

export const diceCounting: MathExercise<Identifiers> = {
  id: "diceCounting",
  connector: "=",
  label: "Dénombrement avec des dés",
  levels: ["TermSpé"],
  isSingleStep: true,
  sections: ["Combinatoire et dénombrement"],
  generator: (nb: number) => getDistinctQuestions(getDiceCountingQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
