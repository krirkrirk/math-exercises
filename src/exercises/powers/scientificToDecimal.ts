/**
 * a*10^x vers décimal
 *  */

import { Decimal, DecimalConstructor } from '#root/math/numbers/decimals/decimal';
import { IntegerConstructor } from '#root/math/numbers/integer/integer';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { shuffle } from '#root/utils/shuffle';
import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
type QCMProps = {
  answer: string;
  tenPower: number;
  decimal: number;
};
type VEAProps = {};
const getScientificToDecimalQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const decScientific = DecimalConstructor.randomScientific(randint(1, 4));
  const tenPower = randint(-5, 6, [0, 1]);
  const answer = decScientific.multiplyByPowerOfTen(tenPower).toTree().toTex();

  const statement = new MultiplyNode(
    new NumberNode(decScientific.value),
    new PowerNode(new NumberNode(10), new NumberNode(tenPower)),
  );
  const statementTex = statement.toTex();
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Donner l'écriture décimale de : $${statementTex}$`,
    startStatement: statementTex,
    answer: answer,
    keys: [],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, decimal: decScientific.value, tenPower },
  };
  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, tenPower, decimal }) => {
  const propositions: Proposition[] = [];
  const decScientific = new Decimal(decimal);
  addValidProp(propositions, answer);

  tryToAddWrongProp(propositions, decScientific.multiplyByPowerOfTen(-tenPower).toTree().toTex());
  while (propositions.length < n) {
    const wrongAnswerTree = decScientific.multiplyByPowerOfTen(randint(-6, 6, [tenPower])).toTree();
    const wrongAnswer = wrongAnswerTree.toTex();
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffleProps(propositions, n);
};

export const scientificToDecimal: MathExercise<QCMProps, VEAProps> = {
  id: 'scientificToDecimal',
  connector: '=',
  label: "Passer d'écriture scientifique à écriture décimale",
  levels: [
    '5ème',
    '4ème',
    '3ème',
    '2nde',
    'CAP',
    '2ndPro',
    '1reESM',
    '1rePro',
    '1reSpé',
    '1reTech',
    'TermPro',
    'TermTech',
  ],
  sections: ['Puissances'],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getScientificToDecimalQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
