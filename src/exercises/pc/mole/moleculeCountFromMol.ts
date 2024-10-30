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
import { randfloat } from "#root/math/utils/random/randfloat";
import { avogadroConstant } from "#root/pc/constants/molecularChemistry/atoms";
import { Measure } from "#root/pc/measure/measure";

type Identifiers = { quantity: number };

const getMoleculeCountFromMolQuestion: QuestionGenerator<Identifiers> = () => {
  const quantity = randfloat(0.01, 100, 2); // Quantité de matière en moles, entre 0.01 et 10 moles

  const numberOfMolecules = avogadroConstant.value
    .times(quantity)
    .toSignificant(2);
  const question: Question<Identifiers> = {
    answer: numberOfMolecules.toTex(),
    instruction: `Calculer le nombre de molécules dans un échantillon contenant $${quantity.frenchify()} \\ mol$ de substance.`,
    keys: ["mol", "timesTenPower"],
    answerFormat: "tex",
    identifiers: { quantity },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, quantity },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const w1 = avogadroConstant.value.divide(quantity).toSignificant(2);
  const w2 = `${answer}\\ mol`;

  tryToAddWrongProp(propositions, w1.toTex());
  tryToAddWrongProp(propositions, w2);
  while (propositions.length < n) {
    const wrongAnswer = (
      parseFloat(answer) * randfloat(0.5, 1.5, 2)
    ).toScientific(2);
    tryToAddWrongProp(propositions, wrongAnswer.toTex());
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, quantity }) => {
  let latexs = [];
  const validanswer1 = avogadroConstant.value
    .times(quantity)
    .toSignificant(1)
    .toTex();
  const validanswer2 = avogadroConstant.value
    .times(quantity)
    .toSignificant(2)
    .toTex();
  const validanswer3 = avogadroConstant.value
    .times(quantity)
    .toSignificant(3)
    .toTex();

  latexs.push(validanswer1);
  latexs.push(validanswer2);
  latexs.push(validanswer3);

  return latexs.includes(ans);
};
export const moleculeCountFromMol: Exercise<Identifiers> = {
  id: "moleculeCountFromMol",
  label: "Calculer le nombre de molécules dans un échantillon",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Chimie organique"],
  generator: (nb: number) =>
    getDistinctQuestions(getMoleculeCountFromMolQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Chimie",
};
