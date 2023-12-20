import { exercises } from "./exercises/exercises";
import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import { IntervalConstructor } from "./math/sets/intervals/intervals";
import { AddNode } from "./tree/nodes/operators/addNode";
import { NumberNode } from "./tree/nodes/numbers/numberNode";
import { operatorComposition } from "./tree/utilities/operatorComposition";
import { MultiplyNode } from "./tree/nodes/operators/multiplyNode";
import { PowerNode } from "./tree/nodes/operators/powerNode";
import {
  getCartesiansProducts,
  getFlatCartesianProducts,
} from "./utils/cartesianProducts";
import { DiscreteSetNode } from "./tree/nodes/sets/discreteSetNode";
import { FractionNode } from "./tree/nodes/operators/fractionNode";
const jsonParser = bodyParser.json();

const allExercises = [...exercises];

const runServer = () => {
  dotenv.config();
  const app: Express = express();
  app.use(cors());
  console.log(
    exercises.length - exercises.filter((exo) => !!exo.isAnswerValid).length,
  );
  // console.log(mul.toAllValidTexs());
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
        propositions: exo.getPropositions?.(4, q.qcmGeneratorProps),
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
