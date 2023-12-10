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
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';

type QCMProps = {
  answer: string;
  firstValue: number;
  reason: number;
  askedRank: number;
};
type VEAProps = {};

const getGeometricExplicitFormulaUsage: QuestionGenerator<QCMProps, VEAProps> = () => {
  const askedRank = randint(0, 10);
  const firstValue = randint(1, 10);
  const reason = randint(2, 10);
  const formula = new MultiplyNode(
    new NumberNode(firstValue),
    new PowerNode(new NumberNode(reason), new VariableNode('n')),
  );
  const formulaTex = simplifyNode(formula).toTex();
  const answer = (firstValue * Math.pow(reason, askedRank)).toString();
  const question: Question<QCMProps, VEAProps> = {
    instruction: `$(u_n)$ est une suite géométrique définie par $u_n = ${formulaTex}$. Calculer : $u_{${askedRank}}$`,
    startStatement: `u_{${askedRank}}`,
    answer,
    keys: ['n', 'u', 'underscore'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, firstValue, reason, askedRank },
  };
  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, firstValue, reason, askedRank }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, (firstValue * Math.pow(reason, randint(0, 9, [askedRank]))).toString());
  }

  return shuffle(propositions);
};

export const geometricExplicitFormulaUsage: MathExercise<QCMProps, VEAProps> = {
  id: 'geometricExplicitFormulaUsage',
  connector: '=',
  label: "Utiliser la formule générale d'une suite géométrique",
  levels: ['1reESM', '1reSpé', '1reTech', '1rePro', 'TermTech', 'TermPro'],
  sections: ['Suites'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getGeometricExplicitFormulaUsage, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
