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
import { coinFlip } from "#root/utils/coinFlip";

type Identifiers = {
  scale: number;
  isSmallScale: boolean;

  fakeDistance: number;
};
const getScaleCalculationQuestion: QuestionGenerator<Identifiers> = () => {
  const isSmallScale = coinFlip();
  const scale = isSmallScale ? randint(1, 5) * 10 : randint(5, 100) * 1000;
  const realUnit = isSmallScale ? DistanceUnit.m : DistanceUnit.km;
  const cm = DistanceUnit.cm;
  const fakeDistanceNb = isSmallScale ? randint(5, 100) : randint(1, 100);

  const fakeDistance = new Measure(fakeDistanceNb, 0, cm);
  const realDistanceNb =
    (scale * fakeDistance.evaluate()) / (isSmallScale ? 100 : 100000);

  const realDistance = new Measure(realDistanceNb, 0, realUnit);

  const instruction = isSmallScale
    ? `Un bateau de $${realDistance.toTex({
        notScientific: true,
      })}$ est représenté par un modèle réduit de $${fakeDistance.toTex({
        notScientific: true,
      })}$. Quelle est l'échelle du modèle réduit ?`
    : `La distance entre deux villes est de $${realDistance.toTex({
        notScientific: true,
      })}$. Sur une carte, cette distance mesure $${fakeDistance.toTex({
        notScientific: true,
      })}$. Quelle est l'échelle de la carte ?`;
  const answer = new Rational(1, scale).toTex();
  const question: Question<Identifiers> = {
    answer,
    instruction,
    keys: [],
    answerFormat: "tex",
    hint: `Convertis les longueurs en $${cm.toTex()}$, puis fais un calcul de propotionnalité.`,
    correction: `On convertit d'abord les longueurs en cm : 
    
$$
${realDistance.toTex({ notScientific: true })} = ${realDistance
      .convert("cm")
      .toTex({ notScientific: true })}
$$

Puis, on fait un calcul de proportionnalité : puisque $${fakeDistance.toTex({
      notScientific: true,
    })}$ représentent $${realDistance.convert("cm").toTex({
      notScientific: true,
    })}$ réels, alors $1${cm.toTex()}$ représente $\\frac{${realDistance
      .convert("cm")
      .toTex({ notScientific: true, hideUnit: true })}}{${fakeDistance.toTex({
      notScientific: true,
      hideUnit: true,
    })}}=${scale}${cm.toTex()}$ réels.

L'échelle est donc de $${answer}$.
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

export const scaleCalculation: Exercise<Identifiers> = {
  id: "scaleCalculation",
  connector: "=",
  label: "Calculer une échelle",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getScaleCalculationQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
