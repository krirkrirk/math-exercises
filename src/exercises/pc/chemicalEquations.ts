import {
  Exercise,
  Proposition,
  Question,
  QuestionGenerator,
  QCMGenerator,
  addValidProp,
  tryToAddWrongProp,
  VEA,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import {
  Reaction,
  ReactionConstructor,
  ReactionSpecies,
} from "#root/pc/molecularChemistry/reaction";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  reactionArray: ReactionSpecies[];
};
const getChemicalEquations: QuestionGenerator<Identifiers> = () => {
  const reaction = ReactionConstructor.randomReaction();
  const answer = reaction.getReactionString();
  const question: Question<Identifiers> = {
    instruction:
      "Equilibrez la réaction suivante :$\\\\$ " +
      reaction.getReactionWithoutCoef(),
    answer,
    keys: [...reaction.getSpeciesName(), "rightarrow"],
    answerFormat: "tex",
    identifiers: { reactionArray: reaction.reactionArray },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, reactionArray },
) => {
  const propositions: Proposition[] = [];
  const reaction = new Reaction(reactionArray);
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, reaction.getReactionWithWrongCoef());
  }
  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const chemicalEquations: Exercise<Identifiers> = {
  id: "chemicalEquations",
  connector: "\\iff",
  label: "Équilibrer une réaction chimique",
  levels: ["4ème", "3ème", "2nde"],
  sections: ["Réaction chimique"],
  subject: "Chimie",
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getChemicalEquations, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
