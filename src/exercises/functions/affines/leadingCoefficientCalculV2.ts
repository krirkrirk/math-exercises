import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Rational } from '#root/math/numbers/rationals/rational';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

type QCMProps = {
  answer: string;
  xA: number;
  xB: number;
  yA: number;
  yB: number;
};
type VEAProps = {};

const getLeadingCoefficientCalculV1Question: QuestionGenerator<QCMProps, VEAProps> = () => {
  const [xA, yA] = [1, 2].map((el) => randint(-9, 10));
  const xB = randint(-9, 10, [xA]);
  const yB = randint(-9, 10);
  const answer = new Rational(yB - yA, xB - xA).simplify().toTree().toTex();

  const question: Question<QCMProps, VEAProps> = {
    instruction: `Soit $d$ une droite passant par les points $A(${xA};${yA})$ et $B(${xB};${yB})$.$\\\\$Déterminer le coefficient directeur de $d$.`,
    answer: answer,
    answerFormat: 'tex',
    keys: [],
    qcmGeneratorProps: { answer, xA, xB, yA, yB },
  };
  return question;
};
const getPropositions: QCMGenerator<QCMProps> = (n, { answer, xA, xB, yA, yB }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    const wrongAnswer = simplifyNode(
      new FractionNode(new NumberNode(yB - yA + randint(-3, 4, [0])), new NumberNode(xB - xA + randint(-3, 4, [0]))),
    ).toTex();
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

export const leadingCoefficientCalculV2: MathExercise<QCMProps, VEAProps> = {
  id: 'leadingCoefficientCalculV2',
  connector: '=',
  label: "Coefficient directeur à l'aide de deux points",
  levels: ['3ème', '2nde', '2ndPro', '1rePro', '1reTech'],
  isSingleStep: false,
  sections: ['Droites'],
  generator: (nb: number) => getDistinctQuestions(getLeadingCoefficientCalculV1Question, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
