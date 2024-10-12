import {
  Exercise,
  Proposition,
  Question,
  QuestionGenerator,
  addValidProp,
  QCMGenerator,
  tryToAddWrongProp,
  VEA,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
import {
  ReactionConstructor,
  ReactionSpecies,
  molecules,
} from "#root/pc/constants/molecularChemistry/reaction";
import { shuffle } from "#root/utils/alea/shuffle";

type Identifiers = {
  reactionArray: ReactionSpecies[];
  randomSpacieIndex: number;
};

const getChemicalReactionsProduct: QuestionGenerator<Identifiers> = () => {
  const reaction = ReactionConstructor.randomReaction();
  const randomSpacieIndex = randint(0, reaction.reactionArray.length);
  const randomSpacie = reaction.reactionArray[randomSpacieIndex];
  const randomSpacieFormula = randomSpacie.species?.formula;
  const randomSpacieCoef =
    Math.abs(randomSpacie.coefficient) === 1
      ? ""
      : Math.abs(randomSpacie.coefficient);

  const answer = randomSpacieCoef + "" + randomSpacieFormula;
  const question: Question<Identifiers> = {
    instruction:
      "Completer la réaction suivante en donnant l'élement manquant : $\\\\$ " +
      reaction.getReactionWithQuestionMark(randomSpacieIndex),
    answer,
    keys: [...reaction.getUniqueAtomNames(), "underscore"],
    answerFormat: "tex",
    identifiers: { reactionArray: reaction.reactionArray, randomSpacieIndex },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      molecules[randint(0, molecules.length)].formula,
    );
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const chemicalReactionsProduct: Exercise<Identifiers> = {
  id: "chemicalReactionsProduct",
  connector: "\\iff",
  label:
    "Identifier le produit ou le réactif manquant d'une réaction chimique donnée",
  levels: ["4ème", "3ème", "2nde"],
  sections: ["Réaction chimique"],
  subject: "Chimie",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getChemicalReactionsProduct, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
