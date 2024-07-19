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
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { Measure } from "#root/pc/measure/measure";
import { planets } from "#root/pc/constants/mechanics/planets";
import { round } from "#root/math/utils/round";
import { earthG, sunMass } from "#root/pc/constants/mechanics/gravitational";

const G = earthG.measure;

type Identifiers = {
  planet: string;
  mass: Measure;
  distance: Measure;
};

const getGravitationalForcePlanetsQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const planetIndex = randint(0, planets.length);
  const selectedPlanet = planets[planetIndex];
  const massSun = sunMass.measure;

  // Convert distance from km to m
  const distanceInMeters = selectedPlanet.distanceFromSun.convert("m");

  const force = G.times(selectedPlanet.mass)
    .times(massSun)
    .divide(distanceInMeters.times(distanceInMeters))
    .toSignificant(2);

  const instruction = `Considérez la planète ${selectedPlanet.name} dans le ${
    selectedPlanet.system
  }. 
  La masse de ${selectedPlanet.name} est de $${selectedPlanet.mass.toTex({
    scientific: 2,
  })}$ et la distance entre ${
    selectedPlanet.name
  } et le Soleil est de $${selectedPlanet.distanceFromSun.toTex({
    scientific: 2,
  })}$. 
  Calculez la force gravitationnelle exercée par le Soleil sur ${
    selectedPlanet.name
  }.

Données:
- Constante de gravitation universelle: $G = ${G.toTex({
    scientific: 2,
  })}$
- Masse du Soleil: $m_{\\text{soleil}} = ${massSun.toTex({
    scientific: 2,
  })}$`;

  const hint = `Utilisez la formule de la force gravitationnelle.`;

  const correction = `La force gravitationnelle est donnée par la formule vectorielle :
  $$\\vec{F}_{\\text{Soleil/${
    selectedPlanet.name
  }}} = -G \\cdot \\frac{m_{\\text{soleil}} \\cdot m_{${selectedPlanet.name.charAt(
    0,
  )}}}{d^2} \\cdot \\vec{u}_{\\text{Soleil→${selectedPlanet.name}}}$$. \n
  La formule de la force gravitationnelle en valeur est :
  $$F_{\\text{Soleil/${
    selectedPlanet.name
  }}} = G \\cdot \\frac{m_{\\text{soleil}} \\cdot m_{${selectedPlanet.name.charAt(
    0,
  )}}}{d^2}$$. \n
  En utilisant les valeurs fournies :
  $$F_{\\text{Soleil/${selectedPlanet.name}}} = ${G.toTex({
    scientific: 2,
  })} \\cdot \\frac{${selectedPlanet.mass.toTex({
    scientific: 2,
  })} \\cdot ${massSun.toTex({
    scientific: 2,
  })}}{(${distanceInMeters.toTex({
    scientific: 2,
  })})^2} = ${force.toTex({ scientific: 2 })}$$. \n
  Donc, la force gravitationnelle exercée par le Soleil sur ${
    selectedPlanet.name
  } est $${force.toTex({ scientific: 2 })}$.`;

  const question: Question<Identifiers> = {
    answer: force.toTex({ scientific: 2 }),
    instruction,
    hint,
    correction,
    keys: ["N", "timesTenPower"],
    answerFormat: "tex",
    identifiers: {
      planet: selectedPlanet.name,
      mass: selectedPlanet.mass,
      distance: selectedPlanet.distanceFromSun,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, mass, distance },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const massSun = sunMass.measure;
  const distanceInMeters = distance.times(1000);
  const correctAnswer = G.times(mass)
    .times(massSun)
    .divide(distanceInMeters.times(distanceInMeters))
    .toSignificant(2);

  const wrongAnswer1 = G.times(mass)
    .times(massSun)
    .divide(distance.times(distance))
    .toSignificant(2);

  const wrongAnswer2 = G.times(mass)
    .times(massSun)
    .times(distanceInMeters.times(distanceInMeters))
    .toSignificant(2);

  const wrongAnswer3 = G.times(mass)
    .times(massSun)
    .divide(distanceInMeters)
    .toSignificant(2);

  tryToAddWrongProp(
    propositions,
    wrongAnswer1.toTex({ scientific: 2, hideUnit: true }),
  ) + "\\ \\text{N}";
  tryToAddWrongProp(
    propositions,
    wrongAnswer2.toTex({ scientific: 2, hideUnit: true }),
  ) + "\\ \\text{N}";
  tryToAddWrongProp(
    propositions,
    wrongAnswer3.toTex({ scientific: 2, hideUnit: true }),
  ) + "\\ \\text{N}";

  while (propositions.length < n) {
    const errorFactor = new Measure(1, randint(1, 5));
    const wrongAnswer = correctAnswer.times(errorFactor);
    tryToAddWrongProp(
      propositions,
      wrongAnswer.toTex({ scientific: 2 }) + "\\ \\text{N}",
    );
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  console.log(ans, answer);
  if (ans === answer) return true;
  return [answer.replace("\\ N", "N"), answer.replace("\\ N", "")].includes(
    ans,
  );
};

export const gravitationalForcePlanets: Exercise<Identifiers> = {
  id: "gravitationalForcePlanets",
  connector: "=",
  label: "Calculer la force gravitationnelle entre le Soleil et une planète",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Mécanique gravitationnelle"],
  generator: (nb: number) =>
    getDistinctQuestions(getGravitationalForcePlanetsQuestion, nb, 8),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
  maxAllowedQuestions: 8,
};
