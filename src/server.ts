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

const jsonParser = bodyParser.json();

const allExercises = [...exercises];

const runServer = () => {
  dotenv.config();
  const app: Express = express();
  app.use(cors());

  // const string = "\\frac{9}{12}";
  // const a = string.match(/^[0-9]+,?[0-9]*/);
  // const before = Date.now();
  // const parsed = parseLatex(string);
  // console.log("res", parsed);
  // console.log(parsed?.toTex());
  // console.log(parsed?.simplify().toTex());
  // console.log(parsed?.evaluate({ x: 1 }));
  // console.log("time", Date.now() - before);
  // tokenize(string);
  // const a = DecimalConstructor.random(-4, 8);
  // const a = new Decimal(-0.0009343);
  // console.log(a.value, a.multiplyByPowerOfTen(-2).toTree().toTex());
  // const b = new Decimal(0.0009343);
  // console.log(b.value, b.multiplyByPowerOfTen(-2).toTree().toTex());
  // const c = new Decimal(-2.00009343);
  // console.log(c.value, c.multiplyByPowerOfTen(-2).toTree().toTex());
  // const d = new Decimal(2.009343);
  // console.log(d.value, d.multiplyByPowerOfTen(-2).toTree().toTex());
  const power = 1;
  const a = new Decimal(-0.00400250009343);
  console.log(a.value, a.multiplyByPowerOfTen(power).toTree().toTex());
  const b = new Decimal(0.04010009343);
  console.log(b.value, b.multiplyByPowerOfTen(power).toTree().toTex());
  const c = new Decimal(-23.00009343);
  console.log(c.value, c.multiplyByPowerOfTen(power).toTree().toTex());
  const d = new Decimal(20.4009343);
  console.log(d.value, d.multiplyByPowerOfTen(power).toTree().toTex());
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
