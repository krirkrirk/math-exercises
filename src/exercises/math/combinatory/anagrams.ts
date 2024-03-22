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
import { random } from "#root/utils/random";
import { v4 } from "uuid";

const words = [
  "angle",
  "armoire",
  "banc",
  "bureau",
  "cabinet",
  "carreau",
  "chaise",
  "classe",
  "clé",
  "coin",
  "couloir",
  "dossier",
  "eau",
  "école",
  "écriture",
  "entrée",
  "escalier",
  "étagère",
  "étude",
  "extérieur",
  "fenêtre",
  "intérieur",
  "lavabo",
  "lecture",
  "lit",
  "marche",
  "matelas",
  "maternelle",
  "meuble",
  "mousse",
  "mur",
  "peluche",
  "placard",
  "plafond",
  "porte",
  "portemanteau",
  "poubelle",
  "radiateur",
  "rampe",
  "récréation",
  "rentrée",
  "rideau",
  "robinet",
  "salle",
  "savon",
  "serrure",
  "serviette",
  "siège",
  "sieste",
  "silence",
  "sol",
  "sommeil",
  "sonnette",
  "sortie",
  "table",
  "tableau",
  "tabouret",
  "tapis",
  "tiroir",
  "toilette",
  "vitre",
];

const letters = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "é",
  "è",
  "à",
  "ç",
];
type Identifiers = {
  word: string;
};

const getAnagramsQuestion: QuestionGenerator<Identifiers> = () => {
  const word = random(words);
  const repeats: number[] = [];
  const wordLetters = word.split("");
  letters.forEach((letter) => {
    const nbOfRepeats = wordLetters.filter((l) => l === letter).length;
    if (nbOfRepeats > 1) repeats.push(nbOfRepeats);
  });

  const getFacto = (n: number): number => {
    if (n === 1) return 1;
    return n * getFacto(n - 1);
  };

  const facto = word
    .split("")
    .map((el, index) => index + 1)
    .reduce((acc, curr) => acc * curr, 1);
  let arrangements = 1;
  repeats.forEach((nbOfRepeats) => {
    arrangements *= getFacto(nbOfRepeats);
  });
  const answer = facto / arrangements + "";

  const question: Question<Identifiers> = {
    answer,
    instruction: `Combien d'anagrammes mathématiques du mot ${word} sont possibles ? `,
    keys: [],
    answerFormat: "tex",
    identifiers: { word },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, word }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, Math.pow(word.length, word.length) + "");
  tryToAddWrongProp(propositions, (word.length * (word.length + 1)) / 2 + "");
  tryToAddWrongProp(propositions, word.length * word.length + "");

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(1000, 10000) + "");
  }

  return shuffleProps(propositions, n);
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const anagrams: Exercise<Identifiers> = {
  id: "anagrams",
  connector: "=",
  label: "Compter le nombre d'anagrammes d'un mot",
  levels: ["TermSpé"],
  isSingleStep: true,
  sections: ["Combinatoire et dénombrement"],
  generator: (nb: number) => getDistinctQuestions(getAnagramsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
