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

type Identifiers = {
  object1: string;
  object2: string;
  reference: "l'autre" | "au sol";
};

const situations = [
  {
    object1: "un avion de chasse",
    object2: "un ravitailleur",
    context:
      "Vous observez un ravitaillement en vol. L'avion de chasse et le ravitailleur maintiennent une position relative constante pendant le ravitaillement.",
  },
  {
    object1: "un passager",
    object2: "un train",
    context:
      "Un passager est assis à l'intérieur d'un train qui roule à une vitesse constante sur une ligne droite.",
  },
  {
    object1: "un conducteur",
    object2: "une voiture",
    context:
      "Un conducteur est au volant d'une voiture qui circule sur une autoroute.",
  },
  {
    object1: "un enfant",
    object2: "un manège",
    context:
      "Un enfant est assis dans un manège qui tourne à une vitesse constante.",
  },
  {
    object1: "la Terre",
    object2: "la Lune",
    context:
      "Vous observez la Terre et la Lune depuis l'espace. La Terre tourne sur elle-même et autour du Soleil, tandis que la Lune tourne autour de la Terre.",
  },
];

const references = ["l'autre", "au sol"] as const;

const determineCorrectAnswer = (
  situation: { object1: string; object2: string; context: string },
  reference: "l'autre" | "au sol",
): string => {
  if (reference === "l'autre") {
    if (
      (situation.object1 === "la Terre" && situation.object2 === "la Lune") ||
      (situation.object1 === "la Lune" && situation.object2 === "la Terre")
    ) {
      return "Vrai";
    }
    return "On ne peut pas savoir";
  } else if (reference === "au sol") {
    if (situation.object1 === "la Terre" || situation.object2 === "la Terre") {
      return "Faux";
    }
    return "Vrai";
  }
  return "On ne peut pas savoir";
};

const getMotionReferenceQuestion: QuestionGenerator<Identifiers> = () => {
  const situationIndex = randint(0, situations.length);
  const situation = situations[situationIndex];
  const referenceIndex = randint(0, references.length);
  const reference = references[referenceIndex];
  const objectToCheckIndex = randint(0, 1);
  const objectToCheck =
    objectToCheckIndex === 0 ? situation.object1 : situation.object2;

  const instruction = `Considérez la situation suivante :\n
  ${situation.context}\n
  ${objectToCheck} est-il en mouvement par rapport à ${
    reference === "l'autre"
      ? situation.object1 === objectToCheck
        ? situation.object2
        : situation.object1
      : "le sol"
  } ?`;

  const correctAnswer = determineCorrectAnswer(situation, reference);

  const hint = `Rappelez-vous que le mouvement est relatif à un point de référence.`;
  const correction = `Le mouvement dépend du point de référence choisi.`;

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

  const possibleAnswers = ["Vrai", "Faux", "On ne peut pas savoir"].filter(
    (a) => a !== answer,
  );

  possibleAnswers.forEach((wrongAnswer) => {
    tryToAddWrongProp(propositions, wrongAnswer, "raw");
  });

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const MotionReferenceExercise: Exercise<Identifiers> = {
  id: "motionReference",
  label: "Déterminer le mouvement relatif entre deux objets",
  levels: ["TermSpé"],
  isSingleStep: true,
  sections: ["Mécanique"],
  answerType: "QCU",
  generator: (nb: number) =>
    getDistinctQuestions(getMotionReferenceQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
};
