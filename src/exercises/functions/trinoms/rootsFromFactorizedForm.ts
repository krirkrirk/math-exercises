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
import { Trinom, TrinomConstructor } from '#root/math/polynomials/trinom';
import { randint } from '#root/math/utils/random/randint';
import { OppositeNode } from '#root/tree/nodes/functions/oppositeNode';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';
type QCMProps = {
  answer: string;
  a: number;
  b: number;
  c: number;
};
type VEAProps = {};

const getRootsFromFactorizedFormQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const trinom = TrinomConstructor.randomFactorized();
  const answer = trinom.getRootsEquationSolutionTex();
  const question: Question<QCMProps, VEAProps> = {
    answer: answer,
    instruction: `Soit $f(x) = ${trinom.getFactorizedForm().toTex()}$. Résoudre l'équation $f(x) = 0$.`,
    keys: ['S', 'equal', 'lbrace', 'semicolon', 'rbrace', 'emptyset'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, a: trinom.a, b: trinom.b, c: trinom.c },
  };

  return question;
};
const getPropositions: QCMGenerator<QCMProps> = (n, { answer, a, b, c }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const trinom = new Trinom(a, b, c);
  const roots = trinom.getRoots();
  if (roots.length === 1 && roots[0] !== 0) {
    tryToAddWrongProp(propositions, `S=\\{${new OppositeNode(new NumberNode(roots[0]))}\\}`);
  }
  if (roots.length === 2 && roots[0] !== 0) {
    tryToAddWrongProp(propositions, `S=\\{${new OppositeNode(new NumberNode(roots[0])).toTex()};${roots[1]}\\}`);
  }
  if (roots.length === 2 && roots[1] !== 0) {
    tryToAddWrongProp(propositions, `S=\\{${roots[0]};${new OppositeNode(new NumberNode(roots[1])).toTex()}\\}`);
  }
  if (roots.length === 2 && roots[0] !== 0 && roots[1] !== 0) {
    tryToAddWrongProp(
      propositions,
      `S=\\{${new OppositeNode(new NumberNode(roots[0])).toTex()};${new OppositeNode(
        new NumberNode(roots[1]),
      ).toTex()}\\}`,
    );
  }

  while (propositions.length < n) {
    const wrongAnswer = `S=\\{${randint(-10, 11)};${randint(-10, 11)}\\}`;
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

export const rootsFromFactorizedForm: MathExercise<QCMProps, VEAProps> = {
  id: 'rootsFromFactorizedForm',
  connector: '=',
  label: "Déterminer les racines d'un trinôme à partir de sa forme factorisée",
  levels: ['1reSpé', 'TermSpé', 'MathComp'],
  isSingleStep: true,
  sections: ['Second degré'],
  generator: (nb: number) => getDistinctQuestions(getRootsFromFactorizedFormQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
