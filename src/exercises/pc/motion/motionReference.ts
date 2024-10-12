import { frenchify } from "#root/math/utils/latex/frenchify";
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
import { randint } from "#root/math/utils/random/randint";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { requiresApostropheBefore } from "#root/utils/strings/requiresApostropheBefore";

type Identifiers = {
  object1: string;
  object2: string;
  reference: "à l'autre" | "au sol";
};

const situations = [
  {
    object1: "avion de chasse",
    object2: "ravitailleur",
    context:
      "Vous observez un ravitaillement en vol. Un avion de chasse et un ravitailleur maintiennent une position relative constante pendant le ravitaillement.",
    gender1: "masculin",
    gender2: "masculin",
    hints: {
      "à l'autre":
        "Les deux avions maintiennent une position relative constante.",
      "au sol": "Les deux avions se déplacent ensemble dans le ciel.",
    },
    corrections: {
      "à l'autre":
        "Les avions ne sont pas en mouvement l'un par rapport à l'autre car ils maintiennent une position relative constante pendant le ravitaillement. Cela signifie que leur vitesse et direction sont les mêmes.",
      "au sol":
        "Les avions sont en mouvement par rapport au sol, car ils volent dans le ciel. Même s'ils restent proches l'un de l'autre, ils se déplacent tous les deux par rapport à la Terre.",
    },
  },
  {
    object1: "passager",
    object2: "train",
    context:
      "Un passager est assis à l'intérieur d'un train qui roule à une vitesse constante sur une ligne droite.",
    gender1: "masculin",
    gender2: "masculin",
    hints: {
      "à l'autre": "Le passager est à l'intérieur du train en mouvement.",
      "au sol": "Le train se déplace sur les rails.",
    },
    corrections: {
      "à l'autre":
        "Le passager n'est pas en mouvement par rapport au train car il est assis à l'intérieur du train en mouvement. Pour un observateur à l'intérieur du train, le passager reste immobile.",
      "au sol":
        "Le train est en mouvement par rapport au sol car il roule sur les rails. Pour un observateur extérieur au train, il est évident que le train se déplace.",
    },
  },
  {
    object1: "conducteur",
    object2: "voiture",
    context:
      "Un conducteur est au volant d'une voiture qui circule sur une autoroute.",
    gender1: "masculin",
    gender2: "féminin",
    hints: {
      "à l'autre": "Le conducteur est au volant de la voiture en mouvement.",
      "au sol": "La voiture roule sur l'autoroute.",
    },
    corrections: {
      "à l'autre":
        "Le conducteur n'est pas en mouvement par rapport à la voiture car il est au volant de celle-ci. Pour lui, il reste à la même place dans la voiture, même si celle-ci se déplace.",
      "au sol":
        "La voiture est en mouvement par rapport au sol car elle roule sur l'autoroute. Cela signifie que la voiture change de position par rapport à la route et au paysage environnant.",
    },
  },
  {
    object1: "enfant",
    object2: "manège",
    context:
      "Un enfant est assis dans un manège qui tourne à une vitesse constante.",
    gender1: "masculin",
    gender2: "masculin",
    hints: {
      "à l'autre": "L'enfant est assis dans le manège en mouvement.",
      "au sol": "Le manège tourne sur place.",
    },
    corrections: {
      "à l'autre":
        "L'enfant n'est pas en mouvement par rapport au manège car il est assis dedans. Pour un observateur sur le manège, l'enfant reste à la même place.",
      "au sol":
        "Le manège est en mouvement par rapport au sol car il tourne sur place. Même si l'enfant reste assis au même endroit dans le manège, le manège tout entier tourne par rapport au sol.",
    },
  },
  {
    object1: "Terre",
    object2: "Lune",
    context:
      "Vous observez la Terre et la Lune depuis l'espace. La Terre tourne sur elle-même et autour du Soleil, tandis que la Lune tourne autour de la Terre.",
    gender1: "féminin",
    gender2: "féminin",
    hints: {
      "à l'autre": "La Lune tourne autour de la Terre.",
      "au sol": "La Terre et la Lune sont en mouvement dans l'espace.",
    },
    corrections: {
      "à l'autre":
        "La Lune est en mouvement par rapport à la Terre car elle tourne autour de celle-ci. Pour un observateur sur la Terre, la position de la Lune change continuellement dans le ciel.",
      "au sol":
        "La Terre et la Lune sont en mouvement par rapport au sol, car elles se déplacent dans l'espace. La Terre tourne sur elle-même et autour du Soleil, et la Lune tourne autour de la Terre.",
    },
  },
];

const references = ["à l'autre", "au sol"] as const;

const determineCorrectAnswer = (
  situation: { object1: string; object2: string; context: string },
  reference: "à l'autre" | "au sol",
): string => {
  if (reference === "à l'autre") {
    if (
      (situation.object1 === "Terre" && situation.object2 === "Lune") ||
      (situation.object1 === "Lune" && situation.object2 === "Terre")
    ) {
      return "Oui";
    }
    return "Non";
  } else if (reference === "au sol") {
    if (situation.object1 === "Terre" && situation.object2 === "Lune") {
      return "Non";
    } else if (situation.object1 === "Lune" && situation.object2 === "Terre") {
      return "Oui";
    }
    return "Oui";
  }

  return "On ne peut pas savoir";
};

const getMotionReferenceQuestion: QuestionGenerator<Identifiers> = () => {
  const situationIndex = randint(0, situations.length);
  const situation = situations[situationIndex];
  const referenceIndex = randint(0, references.length);
  const reference = references[referenceIndex];
  const objectToCheckIndex = coinFlip();
  const objectToCheck = objectToCheckIndex
    ? situation.object1
    : situation.object2;

  const otherObject =
    situation.object1 === objectToCheck ? situation.object2 : situation.object1;
  const referenceText = reference === "à l'autre" ? otherObject : "sol";

  const isMasculine = objectToCheckIndex
    ? situation.gender1 === "masculin"
    : situation.gender2 === "masculin";
  const genderPronoun = isMasculine ? "il" : "elle";

  const instruction = `Considérez la situation suivante :\n
  ${situation.context}\n
  ${
    requiresApostropheBefore(objectToCheck) ? "L'" : "Le "
  }${objectToCheck} est-${genderPronoun} en mouvement par rapport ${
    requiresApostropheBefore(referenceText) ? "à l'" : "au "
  }${referenceText} ?`;

  const correctAnswer = determineCorrectAnswer(situation, reference);

  const hint = situation.hints[reference];
  const correction = situation.corrections[reference];

  const question: Question<Identifiers> = {
    answer: correctAnswer,
    instruction,
    hint,
    correction,
    keys: [],
    answerFormat: "raw",
    identifiers: {
      object1: situation.object1,
      object2: situation.object2,
      reference,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");

  tryToAddWrongProp(propositions, "Oui", "raw");
  tryToAddWrongProp(propositions, "Non", "raw");
  tryToAddWrongProp(propositions, "On ne peut pas savoir", "raw");

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const MotionReferenceExercise: Exercise<Identifiers> = {
  id: "motionReference",
  label: "Déterminer le mouvement relatif entre deux objets",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Mécanique"],
  answerType: "QCU",
  generator: (nb: number) =>
    getDistinctQuestions(getMotionReferenceQuestion, nb, 10),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
  maxAllowedQuestions: 10,
  hasHintAndCorrection: true,
};
