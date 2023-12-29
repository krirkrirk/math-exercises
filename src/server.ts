// import { exercises } from "./exercises";
import * as Exercises from "./exercises";
const exercises = Object.values(Exercises) as MathExercise<any>[];

export { Exercises };
import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import { MathExercise } from "./exercises/exercise";
import { Rational } from "./math/numbers/rationals/rational";
import { MultiplyNode } from "./tree/nodes/operators/multiplyNode";
import { NumberNode } from "./tree/nodes/numbers/numberNode";
import { OppositeNode } from "./tree/nodes/functions/oppositeNode";
const jsonParser = bodyParser.json();

const allExercises = [...exercises];

const runServer = () => {
  dotenv.config();
  const app: Express = express();
  app.use(cors());

  const frac = new Rational(-2, 3).simplify().toTree();
  console.log(frac.toAllValidTexs());
  const prod = new OppositeNode(
    new MultiplyNode(new NumberNode(2), new NumberNode(3)),
  );
  console.log(prod.toAllValidTexs());
  console.log(exercises.length);
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
