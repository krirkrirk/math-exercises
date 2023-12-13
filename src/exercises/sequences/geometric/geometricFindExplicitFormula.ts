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
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';

const getGeometricFindExplicitFormula: QuestionGenerator<QCMProps, VEAProps> = () => {
  const firstRank = 0;
  const firstValue = randint(1, 10);
  const reason = randint(2, 10);

  const formula = new MultiplyNode(
    new NumberNode(firstValue),
    new PowerNode(new NumberNode(reason), new VariableNode('n')),
  );

  const answer = simplifyNode(formula).toTex();

  const question: Question<QCMProps, VEAProps> = {
    instruction: `$(u_n)$ est une suite géométrique de premier terme $u_{${firstRank}} = ${firstValue}$ et de raison $q = ${reason}$. $\\\\$ Donner l'expression de $u_n$ en fonction de $n$.`,

    answer,
    keys: ['un', 'equal', 'q', 'n', 'u', 'underscore'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, reason, firstValue },
  };
  return question;
};
type QCMProps = {
  answer: string;
  reason: number;
  firstValue: number;
};
type VEAProps = {};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, reason, firstValue }) => {
  const propositions: Proposition[] = [];

  addValidProp(propositions, answer);

  tryToAddWrongProp(
    propositions,
    simplifyNode(
      new MultiplyNode(new NumberNode(reason), new PowerNode(new NumberNode(firstValue), new VariableNode('n'))),
    ).toTex(),
  );

  while (propositions.length < n) {
    const wrongAnswer = new MultiplyNode(
      new NumberNode(firstValue + randint(-firstValue, 2 * firstValue + 1)),
      new PowerNode(new NumberNode(reason + +randint(-reason + 1, 2 * reason + 1)), new VariableNode('n')),
    );
    tryToAddWrongProp(propositions, simplifyNode(wrongAnswer).toTex());
  }
  return shuffle(propositions);
};

export const geometricFindExplicitFormula: MathExercise<QCMProps, VEAProps> = {
  id: 'geometricFindExplicitFormula',
  connector: '=',
  label: "Déterminer la formule générale d'une suite géométrique",
  levels: ['1reESM', '1reSpé', '1reTech', '1rePro', 'TermTech', 'TermPro'],
  sections: ['Suites'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getGeometricFindExplicitFormula, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
