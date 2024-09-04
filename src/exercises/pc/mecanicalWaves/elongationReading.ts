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
import { randomColor } from "#root/geogebra/colors";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { randint } from "#root/math/utils/random/randint";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { CosNode } from "#root/tree/nodes/functions/cosNode";
import { PiNode } from "#root/tree/nodes/numbers/piNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";

type Identifiers = {
  amplitude: number;
  period: number;
};

const getElongationReadingQuestion: QuestionGenerator<Identifiers> = () => {
  const amplitude = randint(2, 7);
  const period = randint(1, 8);
  const commands = [
    `f(x) = If(x>=0, ${amplitude}*cos(x* (2*PI)/${period}))`,
    `SetColor(f, "${randomColor()}")`,
  ];
  const ggb = new GeogebraConstructor({
    commands,
    xAxis: { label: "$\\tiny \\text{Temps (s)}$" },
    yAxis: { label: "$\\tiny \\text{y (cm)}$" },
  });

  const frac = new FractionNode(
    new MultiplyNode((2).toTree(), PiNode),
    period.toTree(),
  ).simplify();

  const node = new MultiplyNode(
    amplitude.toTree(),
    new CosNode(new MultiplyNode(frac, new VariableNode("t"))),
  );

  const question: Question<Identifiers> = {
    answer: `y\\left(t\\right)=${node.toTex()}`,
    instruction: `L'élongation d'un point affecté par le passage d'une onde est représentée ci-dessous. L'équation de la fonction correspondante est de la forme $y(t) = A\\cos\\left(\\frac{2\\pi}{T}t\\right)$. Quelle est l'expression numérique de la fonction $y(t)$ ?`,
    keys: ["y", "t", "pi", "cos", "equal"],
    answerFormat: "tex",
    identifiers: { amplitude, period },
    ggbOptions: ggb.getOptions({
      coords: [-1, 20, -10, 10],
    }),
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, amplitude, period },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const frac = new FractionNode(
    new MultiplyNode((2).toTree(), PiNode),
    amplitude.toTree(),
  ).simplify();

  const node = new MultiplyNode(
    period.toTree(),
    new CosNode(new MultiplyNode(frac, new VariableNode("t"))),
  );
  tryToAddWrongProp(propositions, "y\\left(t\\right)=" + node.toTex());
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      "y\\left(t\\right)=" +
        new MultiplyNode(
          randint(1, 10).toTree(),
          new CosNode(
            new MultiplyNode(
              new FractionNode(
                new MultiplyNode((2).toTree(), PiNode),
                randint(1, 10).toTree(),
              ),
              new VariableNode("t"),
            ),
          ),
        ).toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, amplitude, period },
) => {
  const frac = new FractionNode(
    new MultiplyNode((2).toTree(), PiNode),
    period.toTree(),
  ).simplify();

  const node = new MultiplyNode(
    amplitude.toTree(),
    new CosNode(new MultiplyNode(frac, new VariableNode("t"))),
  );
  const equal = new EqualNode(new VariableNode("y\\left(t\\right)"), node);
  const texs = equal.toAllValidTexs({ allowRawRightChildAsSolution: true });
  console.log(texs);
  return texs.includes(ans);
};
export const elongationReading: Exercise<Identifiers> = {
  id: "elongationReading",
  label: "Déterminer l'expression d'une élongation",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Ondes"],
  generator: (nb: number) =>
    getDistinctQuestions(getElongationReadingQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
};
