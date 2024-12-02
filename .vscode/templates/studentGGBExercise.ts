import {
    Exercise,
    Question,
    QuestionGenerator,
    GGBVEA,
    GetHint,
    GetCorrection,
    GetInstruction,
    GetStudentGGBOptions,
    GetGGBAnswer,
  } from '#root/exercises/exercise';
  import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
  
  type Identifiers = {
  };
  
  
  
  const getInstruction : GetInstruction<Identifiers> = (identifiers)=>{
    
  }
  
  const getHint : GetHint<Identifiers> = (identifiers)=>{
    
  }
  const getCorrection : GetCorrection<Identifiers> = (identifiers)=>{
    
  }
  const getGGBAnswer: GetGGBAnswer<Identifiers> = (identifiers)=>{
    
  }

  const getStudentGGBOptions: GetStudentGGBOptions<Identifiers> = (identifiers)=>{
    
  }
  

  const isGGBAnswerValid: GGBVEA<Identifiers> = (ans, {ggbAnswer}) => {
    throw Error("GGBVea not implemented")
  }
  
  const get{{namePascal}}Question: QuestionGenerator<Identifiers>  = ()=>{
    const identifiers: Identifiers = {}
    const question: Question<Identifiers> = {
      ggbAnswer: getGGBAnswer(identifiers),
      instruction: getInstruction(identifiers),
      studentGgbOptions: getStudentGGBOptions(identifiers),
      identifiers,
      hint: getHint(identifiers),
      correction: getCorrection(identifiers)
    };
  
    return question;
  }
  
  export const {{name}}: Exercise<Identifiers> = {
    id: '{{name}}',
    label: undefined,
    isSingleStep: true,
    generator: (nb, opts) => getDistinctQuestions(()=>get{{namePascal}}Question(opts), nb),
    ggbTimer: 60,
    isGGBAnswerValid,
    subject: "Mathématiques",
    getHint,
    getInstruction,
    getCorrection,
    getGGBAnswer,
    getStudentGGBOptions,
    answerType: "GGB"
  };
  