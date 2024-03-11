// import { exercises } from "./exercises";
import * as Exercises from "./exercises";
const exercises = Object.values(Exercises) as MathExercise<any>[];

export { Exercises };
import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import { MathExercise } from "./exercises/exercise";
import { parseLatex } from "./tree/parsers/latexParser";
import { Decimal, DecimalConstructor } from "./math/numbers/decimals/decimal";
import { AddNode } from "./tree/nodes/operators/addNode";
import { MultiplyNode } from "./tree/nodes/operators/multiplyNode";
import { FractionNode } from "./tree/nodes/operators/fractionNode";
import { NumberNode } from "./tree/nodes/numbers/numberNode";
import { SubstractNode } from "./tree/nodes/operators/substractNode";
import { AlgebraicNode } from "./tree/nodes/algebraicNode";
import { NombreConstructor, NumberType } from "./math/numbers/nombre";
import { Integer } from "./math/numbers/integer/integer";
import { RationalConstructor } from "./math/numbers/rationals/rational";
import { VariableNode } from "./tree/nodes/variables/variableNode";
import {
  MinusInfinityNode,
  PlusInfinityNode,
} from "./tree/nodes/numbers/infiniteNode";
import { ClosureType } from "./tree/nodes/sets/intervalNode";
import { Interval } from "./math/sets/intervals/intervals";
import { round } from "./math/utils/round";

const jsonParser = bodyParser.json();

const allExercises = [...exercises];
declare global {
  interface Number {
    toTree: () => AlgebraicNode;
    frenchify: () => string;
  }
}

Number.prototype.toTree = function (): AlgebraicNode {
  const value = this.valueOf();
  if (value === Infinity) return PlusInfinityNode;
  if (value === -Infinity) return MinusInfinityNode;
  return new NumberNode(value);
};
Number.prototype.frenchify = function (): string {
  return (this.valueOf() + "").replace(".", ",");
};
const runServer = () => {
  dotenv.config();
  const app: Express = express();
  app.use(cors());
  console.log(exercises.length);
  console.log(round((35 * 10) / 6, 2) * 100);
  app.get("/", (req: Request, res: Response) => {
    res.json(allExercises);
  });

  app.get("/exo", (req: Request, res: Response) => {
    const exoId = req.query.exoId;
    const exoIndex = allExercises.findIndex((exo) => exo.id == exoId);
    const exo = allExercises[exoIndex];
    if (!exo) res.send("Exo not found");
    const questions = exo?.generator(10);
    res.json({
      exercise: exo,
      questions,
      nextId: allExercises[(exoIndex + 1) % allExercises.length].id,
      prevId:
        allExercises[(exoIndex - 1 + allExercises.length) % allExercises.length]
          .id,
    });
  });

  app.get("/qcmExo", (req: Request, res: Response) => {
    const exoId = req.query.exoId;
    const exoIndex = allExercises.findIndex((exo) => exo.id == exoId);
    const exo = allExercises[exoIndex];

    if (!exo) res.send("Exo not found");
    const questions = exo?.generator(10);
    const populatedQuestions = questions?.map((q) => {
      return {
        ...q,
        propositions: exo.getPropositions?.(4, {
          answer: q.answer,
          ...q.identifiers,
        }),
      };
    });
    res.json({
      exercise: exo,
      questions: populatedQuestions,

      nextId: allExercises[(exoIndex + 1) % allExercises.length].id,
      prevId:
        allExercises[(exoIndex - 1 + allExercises.length) % allExercises.length]
          .id,
    });
  });

  app.post("/vea", jsonParser, (req: Request, res: Response) => {
    const exoId = req.query.exoId;

    const { ans, veaProps } = req.body;
    const exoIndex = allExercises.findIndex((exo) => exo.id == exoId);
    const exo = allExercises[exoIndex];
    if (!exo) {
      res.send("Exo not found");
      return;
    }
    if (!exo.isAnswerValid) {
      res.send("No VEA implemented");
      return;
    }
    const result = exo.isAnswerValid(ans as string, veaProps) ?? false;
    res.json({
      result,
    });
  });

  app.listen("5000", () => {
    console.log(`[server]: Server is running at http://localhost:5000`);
  });
};

runServer();
