import {
  MathExercise,
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
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  z1Re: number;
  z1Im: number;
  z2Re: number;
  z2Im: number;
};

const getAddComplexQuestion: QuestionGenerator<Identifiers> = () => {
  const z1 = ComplexConstructor.random();
  let z2: Complex;
  do {
    z2 = ComplexConstructor.random();
  } while (z1.im === 0 && z2.im === 0);

  const answer = z1.add(z2).toTree().toTex();

  const question: Question<Identifiers> = {
    answer,
    instruction: `Soit $z=${z1.toTree().toTex()}$ et $z'=${z2
      .toTree()
      .toTex()}$. Calculer $z + z'$.`,
    keys: ["i", "z", "quote"],
    answerFormat: "tex",
    startStatement: "z+z'",
    identifiers: {
      z1Re: z1.re,
      z1Im: z1.im,
      z2Re: z2.re,
      z2Im: z2.im,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, z1Re, z1Im, z2Re, z2Im },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const z1 = new Complex(z1Re, z1Im);
  const z2 = new Complex(z2Re, z2Im);
  tryToAddWrongProp(propositions, z1.add(z2.opposite()).toTree().toTex());
  while (propositions.length < n) {
    const wrongAnswer = ComplexConstructor.random();
    tryToAddWrongProp(propositions, wrongAnswer.toTree().toTex());
  }
  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { z1Im, z1Re, z2Im, z2Re }) => {
  const z1 = new Complex(z1Re, z1Im);
  const z2 = new Complex(z2Re, z2Im);
  const answer = z1.add(z2).toTree();
  const texs = answer.toAllValidTexs();
  console.log(ans, texs);
  return texs.includes(ans);
};

export const addComplex: MathExercise<Identifiers> = {
  id: "addComplex",
  connector: "=",
  label: "Additionner deux nombres complexes",
  levels: ["MathExp"],
  isSingleStep: true,
  sections: ["Nombres complexes"],
  generator: (nb: number) => getDistinctQuestions(getAddComplexQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
