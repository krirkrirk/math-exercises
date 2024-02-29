import {
  MathExercise,
  Proposition,
  Question,
  QCMGenerator,
  QuestionGenerator,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
import { shuffle } from "#root/utils/shuffle";
import { v4 } from "uuid";

const getParitySumsAndProductsQuestion: QuestionGenerator<Identifiers> = () => {
  const type = randint(0, 12);
  let instruction = "";
  let answer: "Pair" | "Impair" | "Parfois pair, parfois impair" | "Premier" =
    "Pair";
  switch (type) {
    case 0:
      instruction = "La somme de deux nombres pairs est un nombre...";
      answer = "Pair";
      break;
    case 1:
      instruction = "La somme de deux nombres impairs est un nombre...";
      answer = "Pair";
      break;
    case 2:
      instruction =
        "La somme d'un nombre pair et d'un nombre impair un nombre...";
      answer = "Impair";
      break;
    case 3:
      instruction = "La somme de trois nombres impairs est un nombre...";
      answer = "Impair";
      break;
    case 4:
      instruction = "La somme de trois nombres consécutifs est un nombre...";
      answer = "Parfois pair, parfois impair";
      break;
    case 5:
      instruction = "La somme de quatre nombres consécutifs est un nombre...";
      answer = "Pair";
      break;
    case 6:
      instruction = "Le produit de deux nombres pairs est un nombre...";
      answer = "Pair";
      break;
    case 7:
      instruction = "Le produit de deux nombres impairs est un nombre...";
      answer = "Impair";
      break;
    case 8:
      instruction =
        "Le produit d'un nombre pair et d'un nombre impair est un nombre...";
      answer = "Pair";
      break;
    case 9:
      instruction = "Le produit de trois nombres consécutifs est un nombre...";
      answer = "Pair";
      break;
    case 10:
      instruction = "Le produit de trois nombres impairs est un nombre...";
      answer = "Impair";
      break;
    case 11:
      instruction = "Le produit de trois nombres pairs est un nombre...";
      answer = "Pair";
      break;
  }
  const question: Question<Identifiers> = {
    answer: answer!,
    instruction,
    keys: [],
    answerFormat: "raw",
    identifiers: { type },
  };
  return question;
};

type Identifiers = {
  type: number;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [
    {
      id: v4(),
      statement: `Pair`,
      isRightAnswer: answer === "Pair",
      format: "raw",
    },
    {
      id: v4(),
      statement: `Impair`,
      isRightAnswer: answer === "Impair",
      format: "raw",
    },
    {
      id: v4(),
      statement: `Parfois pair, parfois impair`,
      isRightAnswer: answer === "Parfois pair, parfois impair",
      format: "raw",
    },
    {
      id: v4(),
      statement: `Premier`,
      isRightAnswer: answer === "Premier",
      format: "raw",
    },
  ];
  return shuffle(propositions);
};

export const paritySumsAndProducts: MathExercise<Identifiers> = {
  id: "paritySumsAndProducts",
  connector: "=",
  label: "Parité de sommes et de produits",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Arithmétique"],
  generator: (nb: number) =>
    getDistinctQuestions(getParitySumsAndProductsQuestion, nb, 12),
  qcmTimer: 60,
  freeTimer: 60,
  answerType: "QCM",
  maxAllowedQuestions: 12,
  getPropositions,
};
