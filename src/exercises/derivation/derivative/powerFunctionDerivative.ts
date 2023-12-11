import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  addValidProp,
  shuffleProps,
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
import { v4 } from 'uuid';

type QCMProps = {
  answer: string;
  a: number;
  power: number;
};
type VEAProps = {};

const getPowerFunctionDerivative: QuestionGenerator<QCMProps, VEAProps> = () => {
  const a = randint(-9, 10, [0]);
  const power = randint(2, 10);

  const statement = simplifyNode(
    new MultiplyNode(new NumberNode(a), new PowerNode(new VariableNode('x'), new NumberNode(power))),
  );

  const answerStatement = simplifyNode(
    new MultiplyNode(new NumberNode(a * power), new PowerNode(new VariableNode('x'), new NumberNode(power - 1))),
  );

  const answer = answerStatement.toTex();
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Déterminer la fonction dérivée $f'$ de la fonction $f$ définie par $f(x) =${statement.toTex()}$.`,
    startStatement: `f'(x)`,
    answer,
    keys: ['x'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, a, power },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, a, power }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  tryToAddWrongProp(
    propositions,
    new MultiplyNode(new NumberNode(a), new PowerNode(new VariableNode('x'), new NumberNode(power - 1))).toTex(),
  );
  tryToAddWrongProp(
    propositions,
    new MultiplyNode(new NumberNode(a * power), new PowerNode(new VariableNode('x'), new NumberNode(power))).toTex(),
  );
  tryToAddWrongProp(
    propositions,
    new MultiplyNode(new NumberNode(a - 1), new PowerNode(new VariableNode('x'), new NumberNode(power))).toTex(),
  );
  while (propositions.length < n) {
    const wrongExponent = randint(2, 10);

    tryToAddWrongProp(
      propositions,
      simplifyNode(
        new MultiplyNode(
          new NumberNode(a * wrongExponent),
          new PowerNode(new VariableNode('x'), new NumberNode(wrongExponent - 1)),
        ),
      ).toTex(),
    );
  }

  return shuffleProps(propositions, n);
};

export const powerFunctionDerivative: MathExercise<QCMProps, VEAProps> = {
  id: 'powerFunctionDerivative',
  connector: '=',

  label: "Dérivée d'une fonction puissance",
  levels: ['1reESM', '1reSpé', '1reTech', 'MathComp'],
  sections: ['Dérivation'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getPowerFunctionDerivative, nb),
  getPropositions,

  qcmTimer: 60,
  freeTimer: 60,
};
