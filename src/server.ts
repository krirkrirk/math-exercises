import { exercises } from "./exercises/exercises";
import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import { RationalFrac } from "./math/polynomials/rationalFrac";
import { Polynomial } from "./math/polynomials/polynomial";
import { exponentialPrimitive } from "./exercises/primitive/exponentialPrimitive";
import { expUPrimitive } from "./exercises/primitive/expUPrimitive";
const jsonParser = bodyParser.json();

const allExercises = [...exercises];

const runServer = () => {
  dotenv.config();
  const app: Express = express();
  app.use(cors());
  console.log(
    exercises.filter((exo) => !exo.isAnswerValid).map((exo) => exo.id),
  );
  exercises.forEach((exo, index) => console.log(exo.id, index));
  const exo = expUPrimitive;
  const q = exo.generator(10);
  const props = q.flatMap((question) =>
    exo.getPropositions!(4, question.identifiers!),
  );
  console.log(exo.isAnswerValid!(q[0].answer, q[0].identifiers!));
  console.log(props);
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
        propositions: exo.getPropositions?.(4, q.identifiers),
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
