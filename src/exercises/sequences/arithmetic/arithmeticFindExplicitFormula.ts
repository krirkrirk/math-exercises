import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  addValidProp,
  tryToAddWrongProp,
} from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';

type QCMProps = {
  answer: string;
  firstValue: number;
  reason: number;
};
type VEAProps = {};

const getArithmeticFindExplicitFormula: QuestionGenerator<QCMProps, VEAProps> = () => {
  const firstRank = 0;
  const firstValue = randint(-10, 10);
  const reason = randint(-10, 10, [0]);

  const formula = new Polynomial([firstValue, reason], 'n');
  const answer = formula.toString();
  const question: Question<QCMProps, VEAProps> = {
    instruction: `$(u_n)$ est une suite arithmétique de premier terme $u_{${firstRank}} = ${firstValue}$ et de raison $r = ${reason}$. $\\\\$ Donner l'expression de $u_n$ en fonction de $n$.`,
    startStatement: 'u_n',
    answer,
    keys: ['r', 'n', 'u', 'underscore'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, firstValue, reason },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, firstValue, reason }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      new Polynomial([firstValue + randint(-3, 4), reason + randint(-3, 4, [-reason])], 'n').toString(),
    );
  }

  return shuffle(propositions);
};

export const arithmeticFindExplicitFormula: MathExercise<QCMProps, VEAProps> = {
  id: 'arithmeticFindExplicitFormula',
  connector: '=',
  label: "Déterminer la formule générale d'une suite arithmétique",
  levels: ['1reESM', '1reSpé', '1reTech', '1rePro', 'TermTech', 'TermPro'],
  sections: ['Suites'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getArithmeticFindExplicitFormula, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
