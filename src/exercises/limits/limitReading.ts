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
import { randomColor } from "#root/geogebra/colors";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import {
  Polynomial,
  PolynomialConstructor,
} from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import {
  MinusInfinityNode,
  PlusInfinityNode,
} from "#root/tree/nodes/numbers/infiniteNode";
import {
  NumberNode,
  NumberNodeConstructor,
} from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { LimitNode } from "#root/tree/nodes/operators/limitNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { coinFlip } from "#root/utils/coinFlip";

type Identifiers = {
  type: number;
  to: string;
  from: string | undefined;
  a: number | undefined; // asymptote de a+b/(x-c)
};

const getLimitReadingQuestion: QuestionGenerator<Identifiers> = () => {
  let to: AlgebraicNode;
  let from: "+" | "-" | undefined = undefined;
  const type = randint(1, 3);
  let fct: string;
  let answer = "";
  let a: number | undefined;
  switch (type) {
    case 1: //a + b/(x-c)
      a = randint(-3, 4);
      const b = randint(-1, 2, [0]);
      const c = randint(-5, 6);
      fct = new AddNode(
        new NumberNode(a),
        new FractionNode(
          new NumberNode(b),
          new SubstractNode(new VariableNode("x"), new NumberNode(c)),
        ),
      ).toMathString();
      if (coinFlip()) {
        // limites en +-inf
        answer = a + "";
        to = coinFlip() ? PlusInfinityNode : MinusInfinityNode;
      } else {
        // limite en VI
        to = new NumberNode(c);
        if (coinFlip()) {
          from = "+";
          answer = b > 0 ? PlusInfinityNode.toTex() : MinusInfinityNode.toTex();
        } else {
          from = "-";
          answer = b < 0 ? PlusInfinityNode.toTex() : MinusInfinityNode.toTex();
        }
      }
      break;
    case 2:
    default:
      const aPositive = coinFlip();
      const polyPoints: number[][] = [];
      polyPoints.push([-8, randint(-4, 5)]);
      polyPoints.push([
        -4,
        aPositive ? polyPoints[0][1] + 2 : polyPoints[0][1] - 2,
      ]);
      polyPoints.push([2, polyPoints[0][1]]);
      polyPoints.push([6, polyPoints[1][1]]);
      const pointsString = polyPoints
        .map((point) => `(${point[0]},${point[1]})`)
        .join(",");
      fct = `Polynomial({${pointsString}})`;
      const isPlusInf = coinFlip();
      to = isPlusInf ? PlusInfinityNode : MinusInfinityNode;
      answer = aPositive
        ? isPlusInf
          ? PlusInfinityNode.toTex()
          : MinusInfinityNode.toTex()
        : isPlusInf
        ? MinusInfinityNode.toTex()
        : PlusInfinityNode.toTex();
      break;
  }
  const commands = [`f(x) = ${fct}`, `SetColor(f, "${randomColor()}")`];
  const ggb = new GeogebraConstructor(commands, {
    isAxesRatioFixed: false,
    isGridSimple: true,
  });
  const question: Question<Identifiers> = {
    answer,
    instruction: `Ci-dessous est tracée la courbe représentative d'une fonction $f$. Déterminer la limite: $\\displaystyle ${new LimitNode(
      to,
      new VariableNode("f(x)"),
      from,
    ).toTex()}$`,
    keys: ["infty"],
    commands: ggb.commands,
    coords: [-10, 10, -10, 10],
    options: ggb.getOptions(),
    answerFormat: "tex",
    identifiers: { type, to: to.toTex(), from, a },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, type, to, from, a },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, "+\\infty");
  tryToAddWrongProp(propositions, "-\\infty");
  if (a !== undefined) tryToAddWrongProp(propositions, a + "");
  tryToAddWrongProp(propositions, to);
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(-5, 6) + "");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return answer === ans;
};
export const limitReading: MathExercise<Identifiers> = {
  id: "limitReading",
  connector: "=",
  label: "Conjecturer graphiquement la limite d'une fonction",
  levels: ["1reSpé", "TermSpé", "MathComp"],
  isSingleStep: true,
  sections: ["Limites"],
  generator: (nb: number) => getDistinctQuestions(getLimitReadingQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
