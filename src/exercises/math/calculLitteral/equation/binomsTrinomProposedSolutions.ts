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
} from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';

type Identifiers = {
};

const getBinomsTrinomProposedSolutionsQuestion: QuestionGenerator<Identifiers>  = ()=>{
 
  const question: Question<Identifiers> = {
    answer,
    instruction: ``,
    keys: [],
    answerFormat: 'tex',
    identifiers : {}
  };

  return question;
}

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    throw Error("QCM not implemented")
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, {answer})=>{
  throw Error("VEA not implemented")
}
export const binomsTrinomProposedSolutions: Exercise<Identifiers> = {
  id: 'binomsTrinomProposedSolutions',
  connector: "",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) => getDistinctQuestions(getBinomsTrinomProposedSolutionsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques"
};
