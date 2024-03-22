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

const get{{namePascal}}Question: QuestionGenerator<Identifiers>  = ()=>{
 
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
 
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, {answer})=>{

}
export const {{name}}: Exercise<Identifiers> = {
  id: '{{name}}',
  connector: "",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) => getDistinctQuestions(get{{namePascal}}Question, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
