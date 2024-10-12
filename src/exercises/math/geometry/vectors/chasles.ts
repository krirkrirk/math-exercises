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
import { Vector } from "#root/math/geometry/vector";
import { randint } from "#root/math/utils/random/randint";
import { KeyId } from "#root/types/keyIds";
import { random } from "#root/utils/alea/random";
import { shuffle } from "#root/utils/alea/shuffle";

type Identifiers = {
  randLetters: string[];
  vectors: string[];
};

const letters = "ABCDEFGHIJKLMNPQRSTUVWXYZ";
const invVec = (vec: string) => {
  return `\\overrightarrow{${vec[1]}${vec[0]}}`;
};
const getChaslesQuestion: QuestionGenerator<Identifiers> = () => {
  const nbOfVectors = randint(2, 5);
  const randLetters = shuffle(letters.split("")).slice(0, nbOfVectors + 2);
  let vectors = [];
  for (let i = 0; i < nbOfVectors; i++) {
    vectors.push(`${randLetters[i]}${randLetters[i + 1]}`);
  }
  const answer = `\\overrightarrow{${randLetters[0]}${randLetters[nbOfVectors]}}`;

  vectors = shuffle(vectors).map((vec) =>
    Math.random() < 0.4 ? "-" + invVec(vec) : `+\\overrightarrow{${vec}}`,
  );
  let statement = vectors.join("");
  if (statement[0] === "+") statement = statement.slice(1, statement.length);

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Simplifier : $${statement}$`,
    keys: [
      "overrightarrow",
      ...(randLetters.sort((a, b) => a.localeCompare(b)) as KeyId[]),
    ],
    answerFormat: "tex",
    identifiers: { randLetters, vectors },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, randLetters },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const a = random(randLetters);
    const b = random(randLetters);
    const wrongAnswer = `\\overrightarrow{${a}${b}}`;
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const chasles: Exercise<Identifiers> = {
  id: "chasles",
  connector: "=",
  label: "Relation de Chasles pour les vecteurs",
  levels: ["2nde", "1reESM", "1reSpé"],
  isSingleStep: true,
  sections: ["Vecteurs"],
  generator: (nb: number) => getDistinctQuestions(getChaslesQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
