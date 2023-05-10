import { exercises } from './exercises/exercises';
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

const allExercises = [...exercises];

const runServer = () => {
  dotenv.config();
  const app: Express = express();
  await console.log();
  app.use(cors());

  app.get('/', (req: Request, res: Response) => {
    res.json(allExercises);
  });

  app.get('/exo', (req: Request, res: Response) => {
    const exoId = req.query.exoId;
    const exo = allExercises.find((exo) => exo.id == exoId);
    if (!exo) res.send('Exo not found');
    const questions = exo?.generator(10);
    res.json({
      exercise: exo,
      questions,
    });
  });

  /*console.log(new Droite('D', new NumberNode(2), new NumberNode(-1)).toEquationExpression());
  console.log(
    PointConstructor.fromTwoPoints(
      new Point('A', new NumberNode(0), new NumberNode(-1)),
      new Point('B', new NumberNode(1), new NumberNode(1)),
    ).toEquationExpression(),
  );
  console.log(
    PointConstructor.fromPointAndSlope(
      new Point('A', new NumberNode(0), new NumberNode(-1)),
      new NumberNode(2),
    ).toEquationExpression(),
  );
  console.log(
    PointConstructor.fromPointAndAngle(
      new Point('A', new NumberNode(0), new NumberNode(-1)),
      new NumberNode(1.107),
    ).toEquationExpression(),
  );*/

  //console.log(leadingCoefficient.generator(2));

  app.listen('5000', () => {
    console.log(`[server]: Server is running at http://localhost:5000`);
  });
};

runServer();
