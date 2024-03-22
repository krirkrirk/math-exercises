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
import {
  Decimal,
  DecimalConstructor,
} from "#root/math/numbers/decimals/decimal";
import { Rational } from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";

type Identifiers = {
  num: number;
  denum: number;
  leadingPart: number;
};

/**
 * méthode : x = 0,123123123
 * 1000x = 123,123123
 * 999x = 123
 */
const getPeriodicWritingToFractionQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const periodicPartLength = randint(1, 4);
  const periodicPart: number[] = [];
  for (let i = 0; i < periodicPartLength; i++) {
    periodicPart.push(
      randint(periodicPartLength === 1 ? 1 : 0, 10, periodicPart),
    );
  }
  const num = Number("0." + periodicPart.join("")) * 10 ** periodicPartLength;
  let denumString = "";
  for (let i = 0; i < periodicPartLength; i++) {
    denumString += "9";
  }
  const denum = Number(denumString);
  const leadingPart = DecimalConstructor.random(0, 10, randint(0, 3));
  let x = leadingPart.toTree().toTex();
  if (!x.includes(",")) x += ",";
  for (let i = 0; i < 4; i++) {
    x += periodicPart.join("");
  }
  x += "\\ldots";

  const answer = new Rational(num, denum * 10 ** leadingPart.precision)
    .add(leadingPart.toRational())
    .toTree()
    .toTex();
  const question: Question<Identifiers> = {
    answer,
    instruction: `Ecrire sous forme de fraction : $${x}$`,
    keys: [],
    answerFormat: "tex",
    identifiers: { num, denum, leadingPart: leadingPart.value },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, num, denum, leadingPart },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const leadingPartDec = new Decimal(leadingPart);
  const increments = [-1, 1, 2];
  for (const i of increments) {
    tryToAddWrongProp(
      propositions,
      new Rational(num, denum * 10 ** (leadingPartDec.precision + i))
        .add(leadingPartDec.toRational())
        .toTree()
        .toTex(),
    );
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { denum, leadingPart, num }) => {
  const leadingPartDec = new Decimal(leadingPart);
  const answer = new Rational(num, denum * 10 ** leadingPartDec.precision)
    .add(leadingPartDec.toRational())
    .toTree();
  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};
export const periodicWritingToFraction: Exercise<Identifiers> = {
  id: "periodicWritingToFraction",
  connector: "=",
  label: "Passer de l'écriture décimale périodique à l'écriture fractionnaire",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Fractions"],
  generator: (nb: number) =>
    getDistinctQuestions(getPeriodicWritingToFractionQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
