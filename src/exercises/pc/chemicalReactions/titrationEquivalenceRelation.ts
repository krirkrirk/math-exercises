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
import { frenchify } from "#root/math/utils/latex/frenchify";
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { Measure } from "#root/pc/measure/measure";
import { AmountOfSubstance } from "#root/pc/units/AmountOfSubstance";
import { DivideUnit } from "#root/pc/units/divideUnit";
import { VolumeUnit } from "#root/pc/units/volumeUnit";
import { random } from "#root/utils/alea/random";

type Identifiers = {
  a: number;
  b: number;
  vA: number;
  vB: number;
  cB: number;
};

const titrationReactions = [
  {
    titré: { name: "de l'acide chlorhydrique", symbol: "HCl" },
    titrant: { name: "de l'hydroxyde de sodium", symbol: "NaOH" },
    produit: "NaCl + H_2O",
    coeff: [1, 1],
  },
  {
    titré: { name: "de l'acide acétique", symbol: "CH_3COOH" },
    titrant: { name: "de l'hydroxyde de sodium", symbol: "NaOH" },
    produit: "CH_3COONa + H_2O",
    coeff: [1, 1],
  },
  {
    titré: { name: "de l'acide sulfurique", symbol: "H_2SO_4" },
    titrant: { name: "de l'hydroxyde de sodium", symbol: "NaOH" },
    produit: "Na_2SO_4 + H_2O",
    coeff: [1, 2],
  },
  {
    titré: { name: "de l'acide nitrique", symbol: "HNO_3" },
    titrant: { name: "de l'hydroxyde de sodium", symbol: "NaOH" },
    produit: "NaNO_3 + H_2O",
    coeff: [1, 1],
  },
  {
    titré: { name: "de l'acide oxalique", symbol: "H_2C_2O_4" },
    titrant: { name: "du permanganate de potassium", symbol: "KMnO_4" },
    produit: "MnSO_4 + CO_2 + H_2O",
    coeff: [5, 2],
  },
  {
    titré: { name: "du chlorure de sodium", symbol: "NaCl" },
    titrant: { name: "du nitrate d'argent", symbol: "AgNO_3" },
    produit: "AgCl + NaNO_3",
    coeff: [1, 1],
  },
  {
    titré: { name: "de l'acide ascorbique", symbol: "C_6H_8O_6" },
    titrant: { name: "de l'iode", symbol: "I_2" },
    produit: "C_6H_6O_6 + HI",
    coeff: [1, 1],
  },
  {
    titré: { name: "de l'hydroxyde de calcium", symbol: "Ca(OH)_2" },
    titrant: { name: "de l'acide chlorhydrique", symbol: "HCl" },
    produit: "CaCl_2 + H_2O",
    coeff: [1, 2],
  },
  {
    titré: { name: "de l'acide phosphorique", symbol: "H_3PO_4" },
    titrant: { name: "de l'hydroxyde de sodium", symbol: "NaOH" },
    produit: "Na_3PO_4 + H_2O",
    coeff: [1, 3],
  },
  {
    titré: { name: "de l'acide borique", symbol: "H_3BO_3" },
    titrant: { name: "de l'hydroxyde de sodium", symbol: "NaOH" },
    produit: "NaB(OH)_4",
    coeff: [1, 1],
  },
];
const getTitrationEquivalenceRelationQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const exo = generateExo();

  const question: Question<Identifiers> = {
    answer: exo.answer.toTex(),
    instruction: exo.instruction,
    keys: [],
    hint: exo.hint,
    correction: exo.correction,
    answerFormat: "tex",
    identifiers: {
      a: exo.a,
      b: exo.b,
      vA: exo.vA.getValueAsNumber(),
      vB: exo.vB.getValueAsNumber(),
      cB: exo.cB.getValueAsNumber(),
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, a, b, vA, vB, cB },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const correctAns = round((b * vB * cB) / (a * vA), 2);
  const unit = new DivideUnit(AmountOfSubstance.mol, VolumeUnit.mL);
  let random;
  while (propositions.length < n) {
    random = randfloat(correctAns - 1, correctAns + 2, 2, [correctAns]);
    tryToAddWrongProp(
      propositions,
      new Measure(Math.abs(random), 0, unit).toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, a, b, vA, vB, cB }) => {
  const correctAns = round((b * vB * cB) / (a * vA), 2);
  const unit = new DivideUnit(AmountOfSubstance.mol, VolumeUnit.mL);
  return [
    answer,
    frenchify(correctAns),
    answer.replace(`\\ ${unit.toTex()}`, ""),
  ].includes(ans);
};

const generateExo = () => {
  const reaction = random(titrationReactions);

  const vA = new Measure(5 * randint(2, 11), 0, VolumeUnit.mL);

  const cB = new Measure(
    random([0.05, 0.1, 0.2, 0.25, 0.5, 0.75, 1.0]),
    0,
    new DivideUnit(AmountOfSubstance.mol, VolumeUnit.mL),
  );

  const vB = new Measure(5 * randint(1, 11), 0, VolumeUnit.mL);

  const reactionString = `${reaction.coeff[0] !== 1 ? reaction.coeff[0] : ""}${
    reaction.titré.symbol
  } + ${reaction.coeff[1] !== 1 ? reaction.coeff[1] : ""}${
    reaction.titrant.symbol
  } \\Rightarrow ${reaction.produit}`;

  const hint = `Rappel : Au point d'équivalence, les quantités de matière $${reaction.titré.name}$ et $${reaction.titrant.name}$ sont égales , c'est-à-dire :

- $${reaction.coeff[0]} \\times n(${reaction.titré.symbol}) = ${reaction.coeff[1]} \\times n(${reaction.titrant.symbol})$`;

  const instruction = `On réalise un titrage entre une solution ${
    reaction.titré.name
  }$(${reaction.titré.symbol})$ et une solution ${reaction.titrant.name}$(${
    reaction.titrant.symbol
  })$.
  
- On prélève un volume de $V_A=${vA.toTex({
    notScientific: true,
  })}$ de la solution ${reaction.titré.name} de concentration inconnue $C_A$ 
- On ajoute progressivement une solution ${
    reaction.titrant.name
  } de concentration connue $C_B=${cB.toTex({ notScientific: true })}$
- Le volume ${
    reaction.titrant.name
  } nécessaire pour atteindre le point d'équivalence est $V_B=${vB.toTex({
    notScientific: true,
  })}$
- Réaction : $${reactionString}$

Calculer la concentration $C_A$ de (${
    reaction.titré.name
  }), arrondie au centiéme.
`;
  const answer = cB
    .times(vB)
    .times(reaction.coeff[1])
    .divide(vA.times(reaction.coeff[0]))
    .toSignificant(2);

  const correction = `Utiliser la relation d'équivalence du titrage : 
  
Au point d'équivalence, les quantités de matière ${reaction.titré.name}  et ${
    reaction.titrant.name
  } sont égales , c'est-à-dire :
- $${reaction.coeff[0]} \\times n(${reaction.titré.symbol}) = ${
    reaction.coeff[1]
  } \\times n(${reaction.titrant.symbol})$
- Or, la quantité de matière est donnée par : $n=C \\times V$
- Donc à l'équivalence : $a \\times C_A \\times V_A =b \\times C_B \\times V_B$
- Ce qui donne : $C_A = \\frac{b \\times C_B \\times V_B}{a \\times V_A} \\Rightarrow C_A = \\frac{${
    reaction.coeff[1]
  } \\times ${cB.toTex({ notScientific: true })} \\times ${vB.toTex({
    notScientific: true,
  })}}{${reaction.coeff[0]} \\times ${vA.toTex({
    notScientific: true,
  })}} \\Rightarrow C_A = ${answer.toTex({ notScientific: true })}$`;

  return {
    instruction,
    answer,
    hint,
    correction,
    vA,
    vB,
    cB,
    a: reaction.coeff[0],
    b: reaction.coeff[1],
  };
};

export const titrationEquivalenceRelation: Exercise<Identifiers> = {
  id: "titrationEquivalenceRelation",
  label:
    "Calculer la concentration d'un element titré à l'aide d'une équation de réaction d'un mélange stœchiométrique.",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Réaction chimique"],
  generator: (nb: number) =>
    getDistinctQuestions(getTitrationEquivalenceRelationQuestion, nb, 10),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  maxAllowedQuestions: 10,
  subject: "Physique",
  hasHintAndCorrection: true,
};
