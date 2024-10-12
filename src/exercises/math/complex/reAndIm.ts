import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Complex, ComplexConstructor } from "#root/math/complex/complex";
import { randint } from "#root/math/utils/random/randint";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { shuffle } from "#root/utils/alea/shuffle";
type Identifiers = {
  re: number;
  im: number;
  isRe: boolean;
};

const getReAndImQuestion: QuestionGenerator<Identifiers> = () => {
  const z1 = ComplexConstructor.random();
  const isRe = coinFlip();
  const answer = (isRe ? z1.re : z1.im) + "";

  const question: Question<Identifiers> = {
    answer,
    instruction: `Soit $z=${z1.toTree().toTex()}$. Quelle est la partie ${
      isRe ? "réelle" : "imaginaire"
    } de $z$ ?`,
    keys: ["i", "z"],
    answerFormat: "tex",
    identifiers: { re: z1.re, im: z1.im, isRe },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, re, im, isRe },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, im + "i");
  tryToAddWrongProp(propositions, isRe ? im.toString() : re.toString());

  tryToAddWrongProp(propositions, (-im).toString());

  while (propositions.length < n) {
    const wrongAnswer = randint(-10, 11) + "";

    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const reAndIm: Exercise<Identifiers> = {
  id: "getReAndImQuestion",
  connector: "=",
  getPropositions,

  label: "Identifier partie réelle et partie imaginaire",
  levels: ["MathExp"],
  isSingleStep: true,
  sections: ["Nombres complexes"],
  generator: (nb: number) => getDistinctQuestions(getReAndImQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  isAnswerValid,
  subject: "Mathématiques",
};
