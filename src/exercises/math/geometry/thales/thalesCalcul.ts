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
  GetAnswer,
  GetHint,
  GetCorrection,
  GetInstruction,
  GetKeys,
  GetGGBOptions,
  GetStudentGGBOptions,
  GetGGBAnswer,
  GeneratorOption,
  GeneratorOptionType,
  GeneratorOptionTarget,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { numberVEA } from "#root/exercises/vea/numberVEA";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import {
  Line,
  LineConstructor,
  LineIdentifiers,
} from "#root/math/geometry/line";
import { PointConstructor, PointIdentifiers } from "#root/math/geometry/point";
import {
  Segment,
  SegmentConstructor,
  SegmentIdentifiers,
} from "#root/math/geometry/segment";
import {
  Triangle,
  TriangleConstructor,
  TriangleIdentifiers,
} from "#root/math/geometry/triangle";
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { frac } from "#root/tree/nodes/operators/fractionNode";
import { multiply } from "#root/tree/nodes/operators/multiplyNode";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { random } from "#root/utils/alea/random";
import { randomLetter } from "#root/utils/strings/randomLetter";

type Identifiers = {
  triangleIdentifiers: TriangleIdentifiers;
  insidePointsIdentifiers: PointIdentifiers[];
  segmentAsked: SegmentIdentifiers;
  isPapillon: boolean;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randfloat(3, 20, 1).frenchify());
  }
  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  const triangle = TriangleConstructor.fromIdentifiers(
    identifiers.triangleIdentifiers,
  );
  const pointD = PointConstructor.fromIdentifiers(
    identifiers.insidePointsIdentifiers[0],
  );
  const pointE = PointConstructor.fromIdentifiers(
    identifiers.insidePointsIdentifiers[1],
  );
  //order is important
  const subTriangle = new Triangle(pointD, triangle.vertexB, pointE);

  const segmentAskedName = SegmentConstructor.fromIdentifiers(
    identifiers.segmentAsked,
  ).toInsideName();
  const lengths = [
    ...triangle.getSegments().map((s) => {
      return {
        name: s.toInsideName(),
        length: round(s.getLength(), 1),
      };
    }),
    ...subTriangle.getSegments().map((s) => {
      return {
        name: s.toInsideName(),
        length: round(s.getLength(), 1),
      };
    }),
  ];
  const askedIndex = lengths.findIndex((l) => l.name === segmentAskedName);
  const otherIndex = randint(0, 3, [askedIndex]);
  const ratio = frac(
    lengths[otherIndex].length,
    lengths[otherIndex + 3].length,
  );

  if (askedIndex > 2) {
    return round(
      frac(lengths[askedIndex - 3].length, ratio).evaluate(),
      1,
    ).frenchify();
  } else {
    return round(
      multiply(ratio, lengths[askedIndex + 3].length).evaluate(),
      1,
    ).frenchify();
  }
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  const triangle = TriangleConstructor.fromIdentifiers(
    identifiers.triangleIdentifiers,
  );
  const pointD = PointConstructor.fromIdentifiers(
    identifiers.insidePointsIdentifiers[0],
  );
  const pointE = PointConstructor.fromIdentifiers(
    identifiers.insidePointsIdentifiers[1],
  );
  const subTriangle = new Triangle(pointD, triangle.vertexB, pointE);

  const oppositeSegment = triangle.getSideBName();
  const insideSegmentName =
    identifiers.insidePointsIdentifiers[0].name +
    identifiers.insidePointsIdentifiers[1].name;
  const segmentAskedName = SegmentConstructor.fromIdentifiers(
    identifiers.segmentAsked,
  ).toInsideName();
  const lengths = [
    ...triangle.getSegments().map((s) => {
      return {
        name: s.toInsideName(),
        length: round(s.getLength(), 1).frenchify(),
      };
    }),
    ...subTriangle.getSegments().map((s) => {
      return {
        name: s.toInsideName(),
        length: round(s.getLength(), 1).frenchify(),
      };
    }),
  ];
  return `Dans le triangle $${triangle.getTriangleName()}$ ci-dessous, les droites $\\left(${insideSegmentName}\\right)$ et $\\left(${oppositeSegment}\\right)$ sont parallèles.
  
On sait de plus que : ${lengths
    .filter((e) => e.name !== segmentAskedName)
    .map((e) => `$${e.name}=${e.length}$`)
    .join(" , ")}.

Calculer $${segmentAskedName}$ (arrondir aux dixième).`;
};

// const getHint : GetHint<Identifiers> = (identifiers)=>{

// }
// const getCorrection : GetCorrection<Identifiers> = (identifiers)=>{

// }

const getGGBOptions: GetGGBOptions<Identifiers> = (identifiers) => {
  const triangle = TriangleConstructor.fromIdentifiers(
    identifiers.triangleIdentifiers,
  );

  const points = identifiers.insidePointsIdentifiers.map((d) =>
    PointConstructor.fromIdentifiers(d),
  );

  const subTriangle = new Triangle(points[0], triangle.vertexB, points[1]);

  const seg = new Segment(points[0], points[1]);
  const commands = [
    ...triangle.generateCommands({}),
    ...points.flatMap((p) =>
      p.toGGBCommand({ style: 0, color: "#444444", size: 4 }),
    ),
    ...seg.toGGBCommands(false),
  ];
  if (identifiers.isPapillon) {
    commands.push(
      ...new Segment(points[0], triangle.vertexB).toGGBCommands(false),
    );
    commands.push(
      ...new Segment(points[1], triangle.vertexB).toGGBCommands(false),
    );
  }

  const ggb = new GeogebraConstructor({
    commands,
    hideAxes: true,
    hideGrid: true,
  });
  let coords = triangle.generateCoords();
  if (identifiers.isPapillon) {
    const subCoords = subTriangle.generateCoords();
    coords = [
      Math.min(subCoords[0], coords[0]),
      Math.max(subCoords[1], coords[1]),
      Math.min(subCoords[2], coords[2]),
      Math.max(subCoords[3], coords[3]),
    ];
  }
  return ggb.getOptions({
    coords: coords,
  });
};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return [];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return numberVEA(ans, answer);
};

type Options = {
  configurationType: string;
};
const options: GeneratorOption[] = [
  {
    id: "configurationType",
    label: "Types de figure",
    defaultValue: "Toutes",
    values: ["Toutes", "Uniquement papillon", "Uniquement non papillon"],
    target: GeneratorOptionTarget.generation,
    type: GeneratorOptionType.select,
  },
];
const getThalesFindSideQuestion: QuestionGenerator<Identifiers, Options> = (
  opts,
) => {
  const summitNames = TriangleConstructor.randomName();
  const triangle = TriangleConstructor.createRandomTriangle({
    names: summitNames,
  });

  const isPapillon =
    !opts || opts?.configurationType === "Toutes"
      ? coinFlip()
      : opts.configurationType === "Uniquement papillon"
      ? true
      : false;

  const pointD = PointConstructor.onSegment(
    triangle.vertexA,
    triangle.vertexB,
    randomLetter(true, summitNames),
    isPapillon ? { coefficient: randfloat(1.2, 1.8) } : { spacing: 0.2 },
  );
  const line = new Line(triangle.vertexA, triangle.vertexC);
  const parallel = line.getParallele(pointD);
  const intersectLine = new Line(triangle.vertexB, triangle.vertexC);
  const pointE = parallel.intersect(
    intersectLine,
    randomLetter(true, [...summitNames, pointD.name]),
  );

  const subTriangle = new Triangle(pointD, triangle.vertexB, pointE);
  const segmentAsked = random([
    ...triangle.getSegments(),
    ...subTriangle.getSegments(),
  ]);
  const identifiers: Identifiers = {
    triangleIdentifiers: triangle.toIdentifiers(),
    insidePointsIdentifiers: [pointD.toIdentifiers(), pointE.toIdentifiers()],
    segmentAsked: segmentAsked.toIdentifiers(),
    isPapillon,
  };
  const question: Question<Identifiers, Options> = {
    answer: getAnswer(identifiers),
    instruction: getInstruction(identifiers),
    keys: getKeys(identifiers),
    answerFormat: "tex",
    identifiers,
    // hint: getHint(identifiers),
    // correction: getCorrection(identifiers),
    ggbOptions: getGGBOptions(identifiers),
  };

  return question;
};

export const thalesCalcul: Exercise<Identifiers, Options> = {
  id: "thalesCalcul",
  connector: "=",
  label: "Utiliser le théoreme de Thalès calculer un côté",
  isSingleStep: true,
  generator: (nb, opts) =>
    getDistinctQuestions(() => getThalesFindSideQuestion(opts), nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  // getHint,
  // getCorrection,
  getAnswer,
  getGGBOptions,
  options,
  hasGeogebra: true,
  validateOptions: (opts) => {
    return {
      valid: !!opts?.configurationType,
      message: "Veuillez choisir un type de figure.",
    };
  },
};
