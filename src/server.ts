// import { exercises } from "./exercises";
import * as MathExercises from "./exercises/math";
import * as PCExercises from "./exercises/pc";

import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import { Exercise } from "./exercises/exercise";
import { playground } from "./playground";
import "./prototypesEnhancement";
const jsonParser = bodyParser.json();
const mathExercises = Object.values(MathExercises) as Exercise<any>[];
const pcExercises = Object.values(PCExercises) as Exercise<any>[];

const allExercises = [...mathExercises, ...pcExercises];

const runServer = () => {
  dotenv.config();
  const app: Express = express();
  app.use(cors());
  console.log("math exos", mathExercises.length);
  console.log(
    "math hints",
    mathExercises.filter((exo) => exo.hasHintAndCorrection).length,
  );
  console.log("pc exos", `${pcExercises.length}`);
  playground();

  app.get("/", (req: Request, res: Response) => {
    res.json(allExercises);
  });
  app.get("/mathlive", (req: Request, res: Response) => {
    res.json(mathExercises);
  });
  app.get("/xplive", (req: Request, res: Response) => {
    res.json(pcExercises);
  });

  app.get("/exo", (req: Request, res: Response) => {
    const exoId = req.query.exoId;
    const options = req.query.options
      ? JSON.parse(req.query.options as string)
      : undefined;
    const exoIndex = allExercises.findIndex((exo) => exo.id == exoId);
    const exo = allExercises[exoIndex];
    if (!exo) res.send("Exo not found");
    const questions = exo?.generator(10, options);
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
    const options = req.query.options
      ? JSON.parse(req.query.options as string)
      : undefined;

    const exoIndex = allExercises.findIndex((exo) => exo.id == exoId);
    const exo = allExercises[exoIndex];

    if (!exo) res.send("Exo not found");
    const questions = exo?.generator(10, options);
    const populatedQuestions = questions?.map((q) => {
      return {
        ...q,
        propositions: exo.getPropositions?.(
          4,
          {
            answer: q.answer,
            ...q.identifiers,
          },
          options,
        ),
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
    const options = req.query.options
      ? JSON.parse(req.query.options as string)
      : undefined;

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
    const result = exo.isAnswerValid(ans as string, veaProps, options) ?? false;
    res.json({
      result,
    });
  });

  app.post("/ggbvea", jsonParser, (req: Request, res: Response) => {
    const exoId = req.query.exoId;

    const { ggbAns, ggbVeaProps } = req.body;
    const exoIndex = allExercises.findIndex((exo) => exo.id == exoId);
    const exo = allExercises[exoIndex];
    if (!exo) {
      res.send("Exo not found");
      return;
    }
    if (!exo.isGGBAnswerValid) {
      res.send("No GGBVEA implemented");
      return;
    }
    const result =
      exo.isGGBAnswerValid(ggbAns as string[], ggbVeaProps) ?? false;
    res.json({
      result,
    });
  });

  app.listen("5000", () => {
    console.log(`[server]: Server is running at http://localhost:5000`);
  });
};
runServer();
