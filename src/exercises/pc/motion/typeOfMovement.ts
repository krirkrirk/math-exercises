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
import { Affine, AffineConstructor } from "#root/math/polynomials/affine";
import { randint } from "#root/math/utils/random/randint";
import { random } from "#root/utils/random";

type Identifiers = {};

const getTypeOfMovementQuestion: QuestionGenerator<Identifiers> = () => {
  const exo = generateExercise();
  const ggb = exo.ggb;
  const question: Question<Identifiers> = {
    answer: exo.answer,
    instruction: exo.instruction,
    commands: ggb.commands,
    coords: exo.coords,
    options: ggb.getOptions(),
    keys: [],
    answerFormat: "raw",
    identifiers: {},
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");
  tryToAddWrongProp(propositions, "Rectiligne", "raw");
  tryToAddWrongProp(propositions, "Circulaire", "raw");
  tryToAddWrongProp(propositions, "Curviligne", "raw");
  tryToAddWrongProp(propositions, "On ne peut pas savoir.", "raw");
  return shuffleProps(propositions, n);
};

const generateExercise = () => {
  const movementType = random(["Rectiligne", "Circulaire", "Curviligne"]);

  const ggb = getGgb(movementType);

  const instruction = `Soit le graphique ci-dessous, représentant la position d'un objet en fonction du temps. \n \\
Déterminer le type de mouvement de l'objet.`;

  return {
    instruction,
    answer: movementType,
    movementType,
    ggb: ggb.ggb,
    coords: ggb.coords,
  };
};

const getGgb = (
  movementType: string,
): { ggb: GeogebraConstructor; coords: number[] } => {
  let commands: string[] = [];
  let coords: number[] = [];
  let point1;
  let point2;
  switch (movementType) {
    case "Circulaire":
      const a = randint(1, 3);
      const b = randint(4, 7);
      commands = [
        `Semicircle((${a},4),(${b},8))`,
        `Point({${a},4})`,
        `Point({${b},8})`,
        `Point({${a},8})`,
      ];
      coords = [-2, 10, -2, 10];
      break;
    case "Rectiligne":
      const affine = AffineConstructor.random(
        { min: 1, max: 4 },
        { min: 1, max: 4 },
      );
      point1 = `(2,${affine.calculate(2)})`;
      point2 = `(8,${affine.calculate(8)})`;
      commands = [`Segment(${point1},${point2})`].concat(
        getPoints(movementType, affine),
      );
      coords = [-2, 10, -2, affine.calculate(8) + 5];
      break;
    case "Curviligne":
      commands = [`Function(e^sin(x),0,10)`].concat(getPoints(movementType));
      coords = [-2, 10, -2, 10];
      break;
  }
  return {
    ggb: new GeogebraConstructor(commands, {}),
    coords,
  };
};

const getPoints = (movementType: string, affine?: Affine) => {
  const commands: string[] = [];
  switch (movementType) {
    case "Rectiligne":
      for (let x = 3; x < 8; x++) {
        commands.push(`Point({${x},${affine!.calculate(x)}})`);
      }
      break;
    case "Curviligne":
      for (let x = 1; x < 9; x++) {
        commands.push(`Point({${x},${Math.exp(Math.sin(x))}})`);
      }
      break;
  }

  return commands;
};
export const typeOfMovement: Exercise<Identifiers> = {
  id: "typeOfMovement",
  label: "Déterminer le type de mouvement",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Mécanique"],
  generator: (nb: number) =>
    getDistinctQuestions(getTypeOfMovementQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  answerType: "QCM",
  subject: "Physique",
};
