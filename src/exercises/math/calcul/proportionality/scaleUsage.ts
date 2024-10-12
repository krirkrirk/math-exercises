import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  GGBVEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Rational } from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { Measure } from "#root/pc/measure/measure";
import { DistanceUnit } from "#root/pc/units/distanceUnits";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { coinFlip } from "#root/utils/alea/coinFlip";

type Identifiers = {
  scale: number;
  isSmallScale: boolean;

  fakeDistance: number;
};
const getScaleUsageQuestion: QuestionGenerator<Identifiers> = () => {
  const isSmallScale = coinFlip();
  const isFakeAsked = coinFlip();
  const scale = isSmallScale ? randint(1, 5) * 10 : randint(5, 100) * 1000;
  const realUnit = isSmallScale ? DistanceUnit.m : DistanceUnit.km;
  const cm = DistanceUnit.cm;
  const fakeDistanceNb = isSmallScale ? randint(5, 100) : randint(1, 100);

  const fakeDistance = new Measure(fakeDistanceNb, 0, cm);
  const realDistanceNb =
    (scale * fakeDistance.evaluate()) / (isSmallScale ? 100 : 100000);

  const realDistance = new Measure(realDistanceNb, 0, realUnit);
  const scaleFrac = new Rational(1, scale).toTex();

  const answer = (isFakeAsked ? fakeDistanceNb : realDistanceNb).frenchify();
  const instruction = `Une carte est à l'échelle $${scaleFrac}$. ${
    !isFakeAsked
      ? `Quelle est la distance réelle représentée par $${fakeDistance.toTex({
          notScientific: true,
        })}$ sur cette carte ? Donner la réponse en $${realUnit.toTex()}$.`
      : `Quelle est la distance représentée sur la carte pour une distance réelle de $${realDistance.toTex(
          { notScientific: true },
        )}$ ? Donner la distance en $${cm.toTex()}$.`
  }`;

  const question: Question<Identifiers> = {
    answer,
    instruction,
    keys: [],
    answerFormat: "tex",
    hint: `La carte est à l'échelle $${scaleFrac}$ : cela signifie que $1${cm.toTex()}$ sur cette carte représente $${scale}${cm.toTex()}$ dans la réalité. Il faut donc faire un calcul de proportionnalité.`,
    correction: `La carte est à l'échelle $${scaleFrac}$ : cela signifie que $1${cm.toTex()}$ sur cette carte représente $${scale}${cm.toTex()}$ dans la réalité.

    ${
      isFakeAsked
        ? `
On convertit d'abord la distance réelle en $${cm.toTex()}$ : 

    
$$
${realDistance.toTex({ notScientific: true })} = ${realDistance
            .convert("cm")
            .toTex({ notScientific: true })}
$$

Ainsi, $${realDistance.toTex({
            notScientific: true,
          })}$ dans la réalité représentent $\\frac{
            ${realDistance.convert("cm").toTex({
              notScientific: true,
            })}}{${scale}} = ${fakeDistance.toTex({
            notScientific: true,
          })}$ sur la carte.`
        : `
Donc, $${fakeDistance.toTex({
            notScientific: true,
          })}$ sur la carte représentent $${new MultiplyNode(
            fakeDistanceNb.toTree(),
            scale.toTree(),
          ).toTex()} = ${realDistance.convert("cm").toTex({
            notScientific: true,
          })}$ dans la réalité. On convertit alors en $${realUnit.toTex()}$ : la distance réelle est donc $${answer}${realUnit.toTex()}$.`
    }
    
    `,
    identifiers: {
      scale,
      fakeDistance: fakeDistanceNb,
      isSmallScale,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, scale, isSmallScale },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      new Rational(
        1,
        isSmallScale ? randint(1, 5) * 10 : randint(5, 100) * 1000,
      ).toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const scaleUsage: Exercise<Identifiers> = {
  id: "scaleUsage",
  connector: "=",
  label: "Utiliser une échelle",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) => getDistinctQuestions(getScaleUsageQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
