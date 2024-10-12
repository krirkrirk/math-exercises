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
import { randint } from "#root/math/utils/random/randint";
import { Log10Node, isLog10Node } from "#root/tree/nodes/functions/log10Node";
import { LogNode } from "#root/tree/nodes/functions/logNode";
import { OppositeNode } from "#root/tree/nodes/functions/oppositeNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { operatorComposition } from "#root/tree/utilities/operatorComposition";
import { random } from "#root/utils/alea/random";

type Identifiers = {
  nb: number;
  powers: number[];
  signs: number[];
  isLog10: boolean;
};

const getLog10SumSimplifyingQuestion: QuestionGenerator<
  Identifiers,
  { isLog10: boolean }
> = (opts) => {
  const nb = randint(2, 10);
  const trueNb = [2, 4, 8].includes(nb) ? 2 : [3, 9].includes(nb) ? 3 : nb;
  const nbTerms = randint(2, 4);
  const powers: number[] = [];
  const signs: number[] = [];
  for (let i = 0; i < nbTerms; i++) {
    const power = randint(powers.includes(1) ? 2 : 1, 6, powers);
    powers.push(power);
    signs.push(random([-1, 1]));
  }

  const nbNode = new NumberNode(nb);
  const LNode = opts?.isLog10 ? Log10Node : LogNode;
  const logs = powers.map((power, index) =>
    nb ** power < 100
      ? signs[index] > 0
        ? new LNode(new NumberNode(nb ** power))
        : new OppositeNode(new LNode(new NumberNode(nb ** power)))
      : signs[index] > 0
      ? new LNode(new PowerNode(nbNode, new NumberNode(power)))
      : new OppositeNode(
          new LNode(new PowerNode(nbNode, new NumberNode(power))),
        ),
  );
  const statement = operatorComposition(AddNode, logs);
  const answer = statement.simplify();
  const question: Question<Identifiers> = {
    answer: answer.toTex(),
    instruction: `Exprimer le nombre suivant sous la forme $a${
      opts?.isLog10 ? "\\log" : "\\ln"
    }\\left(${trueNb}\\right)$ : $\\newline ${statement.toTex()}$`,
    keys: [opts?.isLog10 ? "log" : "ln"],
    answerFormat: "tex",
    identifiers: { nb, powers, signs, isLog10: opts?.isLog10 ?? false },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, nb, isLog10 },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const LNode = isLog10 ? Log10Node : LogNode;

  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      new MultiplyNode(
        new NumberNode(randint(1, 10)),
        new LNode(new NumberNode(nb)),
      )
        .simplify()
        .toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { nb, powers, signs, isLog10 },
) => {
  const nbNode = new NumberNode(nb);
  const LNode = isLog10 ? Log10Node : LogNode;

  const logs = powers.map((power, index) =>
    nb ** power < 100
      ? signs[index] > 0
        ? new LNode(new NumberNode(nb ** power))
        : new OppositeNode(new LNode(new NumberNode(nb ** power)))
      : signs[index] > 0
      ? new LNode(new PowerNode(nbNode, new NumberNode(power)))
      : new OppositeNode(
          new LNode(new PowerNode(nbNode, new NumberNode(power))),
        ),
  );
  const statement = operatorComposition(AddNode, logs);
  const answer = statement.simplify();
  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};
export const log10SumSimplifying: Exercise<Identifiers> = {
  id: "log10SumSimplifying",
  connector: "=",
  label: "Simplifer une somme de logarithmes décimaux",
  levels: ["TermTech"],
  isSingleStep: true,
  sections: ["Logarithme décimal"],
  generator: (nb: number) =>
    getDistinctQuestions(
      () => getLog10SumSimplifyingQuestion({ isLog10: true }),
      nb,
    ),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
export const logSumSimplifying: Exercise<Identifiers> = {
  id: "logSumSimplifying",
  connector: "=",
  label: "Simplifer une somme de logarithmes népériens",
  levels: ["TermSpé", "MathComp"],
  isSingleStep: true,
  sections: ["Logarithme népérien"],
  generator: (nb: number) =>
    getDistinctQuestions(
      () => getLog10SumSimplifyingQuestion({ isLog10: false }),
      nb,
    ),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
