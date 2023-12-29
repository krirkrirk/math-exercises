import {
  MathExercise,
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
import { NodeOptions } from "#root/tree/nodes/node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";

type Identifiers = {
  a: number;
  power: number;
};

const getPowerFunctionDerivative: QuestionGenerator<Identifiers> = () => {
  const a = randint(-9, 10, [0]);
  const power = randint(2, 10);

  const statement = new MultiplyNode(
    new NumberNode(a),
    new PowerNode(new VariableNode("x"), new NumberNode(power)),
  );
  const answerStatement =
    power > 2
      ? new MultiplyNode(
          new NumberNode(a * power),
          new PowerNode(new VariableNode("x"), new NumberNode(power - 1)),
        )
      : new MultiplyNode(new NumberNode(a * power), new VariableNode("x"));

  const answer = answerStatement.toTex();
  const question: Question<Identifiers> = {
    instruction: `Déterminer la fonction dérivée $f'$ de la fonction $f$ définie par $f(x) =${statement.toTex()}$.`,
    startStatement: `f'(x)`,
    answer,
    keys: ["x"],
    answerFormat: "tex",
    identifiers: { a, power },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, a, power },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  if (power === 2)
    tryToAddWrongProp(
      propositions,
      new MultiplyNode(new NumberNode(a), new VariableNode("x")).toTex(),
    );
  if (power > 2)
    tryToAddWrongProp(
      propositions,
      new MultiplyNode(
        new NumberNode(a),
        new PowerNode(new VariableNode("x"), new NumberNode(power - 1)),
      ).toTex(),
    );
  tryToAddWrongProp(
    propositions,
    new MultiplyNode(
      new NumberNode(a * power),
      new PowerNode(new VariableNode("x"), new NumberNode(power)),
    ).toTex(),
  );
  if (a !== 1)
    tryToAddWrongProp(
      propositions,
      new MultiplyNode(
        new NumberNode(a - 1),
        new PowerNode(new VariableNode("x"), new NumberNode(power)),
      ).toTex(),
    );
  while (propositions.length < n) {
    const wrongExponent = randint(2, 10);
    if (wrongExponent === 2) {
      tryToAddWrongProp(
        propositions,
        new MultiplyNode(
          new NumberNode(a * wrongExponent),
          new VariableNode("x"),
        ).toTex(),
      );
    } else {
      tryToAddWrongProp(
        propositions,
        new MultiplyNode(
          new NumberNode(a * wrongExponent),
          new PowerNode(
            new VariableNode("x"),
            new NumberNode(wrongExponent - 1),
          ),
        ).toTex(),
      );
    }
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, power }) => {
  const opts: NodeOptions = { forbidPowerToProduct: true };
  const answerTree =
    power > 2
      ? new MultiplyNode(
          new NumberNode(a * power),
          new PowerNode(new VariableNode("x"), new NumberNode(power - 1), opts),
          opts,
        )
      : new MultiplyNode(
          new NumberNode(a * power),
          new VariableNode("x"),
          opts,
        );
  const texs = answerTree.toAllValidTexs();
  console.log(texs);
  return texs.includes(ans);
};

export const powerFunctionDerivative: MathExercise<Identifiers> = {
  id: "powerFunctionDerivative",
  connector: "=",

  label: "Dérivée d'une fonction puissance",
  levels: ["1reESM", "1reSpé", "1reTech", "MathComp"],
  sections: ["Dérivation"],
  isSingleStep: false,
  generator: (nb: number) =>
    getDistinctQuestions(getPowerFunctionDerivative, nb),
  getPropositions,
  isAnswerValid,
  qcmTimer: 60,
  freeTimer: 60,
};
