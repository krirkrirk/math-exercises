import {
  MathExercise,
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

type QCMProps = {
  answer: string;
};
type VEAProps={}

const get{{namePascal}}Question: QuestionGenerator<QCMProps, VEAProps>  = ()=>{
 
  const question: Question<QCMProps, VEAProps> = {
    answer: ``,
    instruction: ``,
    keys: [],
    answerFormat: 'tex',
    qcmGeneratorProps : {answer}
  };

  return question;
}

const getPropositions: QCMGenerator<QCMProps> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
 
  }
  return shuffleProps(propositions, n);
};
export const {{name}}: MathExercise<QCMProps, VEAProps> = {
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
};
