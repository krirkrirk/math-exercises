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
import { randint } from "#root/math/utils/random/randint";
import { Measure } from "#root/pc/measure/measure";
import { AmountOfSubstance } from "#root/pc/units/AmountOfSubstance";
import { DivideUnit } from "#root/pc/units/divideUnit";
import { VolumeUnit } from "#root/pc/units/volumeUnit";
import { random } from "#root/utils/random";

type Identifiers = {};

const titrationReactions = [
  {
    titré: { name: "de l'acide chlorhydrique", symbol: "HCl" },
    titrant: { name: "de l'hydroxyde de sodium", symbol: "NaOH" },
    produit: "NaCl + H₂O",
    coeff: [1, 1],
  },
  {
    titré: { name: "de l'acide acétique", symbol: "CH₃COOH" },
    titrant: { name: "de l'hydroxyde de sodium", symbol: "NaOH" },
    produit: "CH₃COONa + H₂O",
    coeff: [1, 1],
  },
  {
    titré: { name: "de l'acide sulfurique", symbol: "H₂SO₄" },
    titrant: { name: "de l'hydroxyde de sodium", symbol: "NaOH" },
    produit: "Na₂SO₄ + H₂O",
    coeff: [1, 2],
  },
  {
    titré: { name: "de l'acide nitrique", symbol: "HNO₃" },
    titrant: { name: "de l'hydroxyde de sodium", symbol: "NaOH" },
    produit: "NaNO₃ + H₂O",
    coeff: [1, 1],
  },
  {
    titré: { name: "de l'acide oxalique", symbol: "H₂C₂O₄" },
    titrant: { name: "du permanganate de potassium", symbol: "KMnO₄" },
    produit: "MnSO₄ + CO₂ + H₂O",
    coeff: [5, 2],
  },
  {
    titré: { name: "du chlorure de sodium", symbol: "NaCl" },
    titrant: { name: "du nitrate d'argent", symbol: "AgNO₃" },
    produit: "AgCl + NaNO₃",
    coeff: [1, 1],
  },
  {
    titré: { name: "de l'acide ascorbique", symbol: "C₆H₈O₆" },
    titrant: { name: "de l'iode", symbol: "I₂" },
    produit: "C₆H₆O₆ + HI",
    coeff: [1, 1],
  },
  {
    titré: { name: "de l'hydroxyde de calcium", symbol: "Ca(OH)₂" },
    titrant: { name: "de l'acide chlorhydrique", symbol: "HCl" },
    produit: "CaCl₂ + H₂O",
    coeff: [1, 2],
  },
  {
    titré: { name: "de l'acide phosphorique", symbol: "H₃PO₄" },
    titrant: { name: "de l'hydroxyde de sodium", symbol: "NaOH" },
    produit: "Na₃PO₄ + H₂O",
    coeff: [1, 3],
  },
  {
    titré: { name: "de l'acide borique", symbol: "H₃BO₃" },
    titrant: { name: "de l'hydroxyde de sodium", symbol: "NaOH" },
    produit: "NaB(OH)₄",
    coeff: [1, 1],
  },
];
const getTitrationEquivalenceRelationQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const exo = generateExo();

  const question: Question<Identifiers> = {
    answer: exo.answer.toTex({ notScientific: true }),
    instruction: exo.instruction,
    keys: [],
    hint: exo.hint,
    answerFormat: "tex",
    identifiers: {},
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {}
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

const generateExo = () => {
  const reaction = random(titrationReactions);

  const vA = new Measure(5 * randint(2, 11), 0, VolumeUnit.mL);

  const cB = new Measure(
    random([0.05, 0.1, 0.2, 0.25, 0.5, 0.75, 1.0]),
    0,
    new DivideUnit(AmountOfSubstance.mol, VolumeUnit.L),
  );

  const vB = new Measure(5 * randint(1, 11), 0, VolumeUnit.mL);

  const reactionString = `${reaction.coeff[0] !== 1 ? reaction.coeff[0] : ""}${
    reaction.titré.symbol
  } + ${reaction.coeff[1] !== 1 ? reaction.coeff[1] : ""}${
    reaction.titrant.symbol
  } \\Rightarrow ${reaction.produit}`;

  const correction = `d`;

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

Calculer la concentration $C_A$ de (${reaction.titré.name}).
`;

  const answer = cB
    .times(vB)
    .times(reaction.coeff[1])
    .divide(vA.times(reaction.coeff[0]))
    .toSignificant(1);

  const hint = `Utiliser la relation d'équivalence du titrage : 
  
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

  return { instruction, answer, hint, correction, vA, vB, cB };
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
};
