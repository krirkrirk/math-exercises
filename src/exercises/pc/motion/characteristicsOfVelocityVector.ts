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
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { coinFlip } from "#root/utils/coinFlip";

type Identifiers = {
  norm: number;
};

const getCharacteristicsOfVelocityVectorQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const exo = generateExercise();
  const question: Question<Identifiers> = {
    answer: exo.answer.frenchify(),
    instruction: exo.instruction,
    keys: [],
    commands: exo.ggb.commands,
    coords: exo.ggbCoords,
    answerFormat: "tex",
    identifiers: { norm: exo.answer },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, norm }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    let random = randfloat(norm - 3, norm + 4, 2, [norm]);
    tryToAddWrongProp(propositions, random.frenchify());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

const generateExercise = () => {
  const delta = randint(2, 11);
  const ggb = getGgb(delta);

  const instruction = `
  Un objet en mouvement rectiligne uniforme est suivi par une chronographie. \n \\
  Les points marqués par la chronographie sur la bande de papier sont espacés uniformément en temps, avec un intervalle de $${delta}$ seconde entre chaque point. \n \\
  Calculer la norme du vecteur vitesse $\\overrightarrow{M}$
  `;

  const answer = ggb.speedVector!.norm;

  return {
    instruction,
    ggb: new GeogebraConstructor(ggb.commands, { isAxesRatioFixed: true }),
    ggbCoords: ggb.coords,
    answer,
  };
};

const getGgb = (delta: number) => {
  const commands = [];
  const constant = randint(3, 8);
  const step = randint(3, 8);
  let speedVector = null;
  for (let x = 0; x < 4 * step; x += step) {
    if ((speedVector === null && coinFlip()) || x === 2 * step)
      speedVector = {
        x1: x,
        y1: constant,
        x2: x + step,
        y2: constant,
        norm: +(step / delta).toFixed(2),
      };

    commands.push(`Point({${x},${constant}})`);
  }
  commands.push(
    ` M = Vector((${speedVector!.x1},${speedVector!.y1}),(${speedVector!.x2},${
      speedVector!.y2
    }))`,
    `Text("$\\overrightarrow{\\mathit{M}}$",(${speedVector!.x1},${
      speedVector!.y1 + 2
    }),false,true)`,
  );
  return {
    commands,
    speedVector,
    coords: [-1, Math.max(step * 5, 20), -2, 10],
  };
};

export const characteristicsOfVelocityVector: Exercise<Identifiers> = {
  id: "characteristicsOfVelocityVector",
  label: "calculer la norme d'un vecteur vitesse",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Mécanique"],
  generator: (nb: number) =>
    getDistinctQuestions(getCharacteristicsOfVelocityVectorQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
};
