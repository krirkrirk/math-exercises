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
import { Rational } from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { shuffle } from "#root/utils/alea/shuffle";

type Identifiers = {
  xA: number;
  xB: number;
  yA: number;
  yB: number;
};

const getLeadingCoefficientCalculV1Question: QuestionGenerator<
  Identifiers
> = () => {
  const [xA, yA] = [1, 2].map((el) => randint(-9, 10));
  const xB = randint(-9, 10, [xA]);
  const yB = randint(-9, 10);
  const answer = new Rational(yB - yA, xB - xA).simplify().toTree().toTex();

  const question: Question<Identifiers> = {
    instruction: `Soit $d$ une droite passant par les points $A(${xA};${yA})$ et $B(${xB};${yB})$.$\\\\$Déterminer le coefficient directeur de $d$.`,
    answer: answer,
    answerFormat: "tex",
    keys: [],
    identifiers: { xA, xB, yA, yB },
  };
  return question;
};
const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, xA, xB, yA, yB },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    const wrongAnswer = new Rational(
      yB - yA + randint(-3, 4, [0]),
      xB - xA + randint(-3, 4, [xA - xB]),
    )
      .simplify()
      .toTree()
      .toTex();
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { xA, xB, yA, yB }) => {
  const answer = new Rational(yB - yA, xB - xA)
    .simplify()
    .toTree({ allowFractionToDecimal: true });

  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};

export const leadingCoefficientCalculV2: Exercise<Identifiers> = {
  id: "leadingCoefficientCalculV2",
  connector: "=",
  label: "Coefficient directeur à l'aide de deux points",
  levels: ["3ème", "2nde", "2ndPro", "1rePro", "1reTech"],
  isSingleStep: false,
  sections: ["Droites", "Fonctions affines"],
  generator: (nb: number) =>
    getDistinctQuestions(getLeadingCoefficientCalculV1Question, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
