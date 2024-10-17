import {
  Exercise,
  GetInstruction,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { IntegerConstructor } from "#root/math/numbers/integer/integer";
import { randint } from "#root/math/utils/random/randint";
import { shuffle } from "#root/utils/alea/shuffle";
import { dollarize } from "#root/utils/latex/dollarize";
import { mdTable } from "#root/utils/markdown/mdTable";

type Identifiers = {
  xValues: number[];
  yValues: number[];
};

const getInstruction: GetInstruction<Identifiers> = ({ xValues, yValues }) => {
  let dataTable = mdTable([
    xValues.map((n) => dollarize(n.frenchify())),
    yValues.map((n) => dollarize(n.frenchify())),
  ]);
  return `On considère le tableau de proportionnalité suivant : 
  
${dataTable}
      
Calculer le coefficient de proportionnalité.`;
};

const getProportionalityTableCoefficient: QuestionGenerator<
  Identifiers
> = () => {
  const factor = randint(2, 15);

  const xValues = IntegerConstructor.randomDifferents(1, 100 / factor, 3).sort(
    (a, b) => a - b,
  );
  const yValues = xValues.map((x) => x * factor);

  const answer = factor.toTree().toTex();
  const identifiers = { xValues, yValues };
  const question: Question<Identifiers> = {
    instruction: getInstruction(identifiers),
    answer,
    keys: [],
    answerFormat: "tex",
    identifiers,
    style: { tableHasNoHeader: true },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      (Number(answer) + randint(-3, 3, [0])).toString(),
    );
  }
  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const proportionalityTableCoefficient: Exercise<Identifiers> = {
  id: "proportionalityTableCoefficient",
  connector: "=",
  label: "Calculer un coefficient de proportionnalité à partir d'un tableau",
  levels: ["6ème", "5ème", "4ème", "3ème", "CAP", "2ndPro", "1rePro"],
  isSingleStep: false,
  sections: ["Proportionnalité"],
  generator: (nb: number) =>
    getDistinctQuestions(getProportionalityTableCoefficient, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  getInstruction,
};
