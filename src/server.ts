// import { exercises } from "./exercises";
import * as MathExercises from "./exercises/math";
import * as PCExercises from "./exercises/pc";

import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import { Exercise } from "./exercises/exercise";
import { NumberNode } from "./tree/nodes/numbers/numberNode";
import { AlgebraicNode } from "./tree/nodes/algebraicNode";
import {
  MinusInfinityNode,
  PlusInfinityNode,
} from "./tree/nodes/numbers/infiniteNode";
import { Decimal } from "./math/numbers/decimals/decimal";
import { round, roundSignificant } from "./math/utils/round";
import { MultiplyNode } from "./tree/nodes/operators/multiplyNode";
import { PowerNode } from "./tree/nodes/operators/powerNode";
import { toScientific } from "./utils/numberPrototype/toScientific";
import { Measure } from "./pc/measure/measure";
import { atomes } from "./pc/molecularChemistry/atome";
import { getElectronicConfigurationFromShells } from "./exercises/utils/getElectronicConfigurationFromShells";
import { getAtoms } from "./exercises/utils/getAtoms";
import { CosNode } from "./tree/nodes/functions/cosNode";
import { FractionNode } from "./tree/nodes/operators/fractionNode";
import { PiNode } from "./tree/nodes/numbers/piNode";
import { VariableNode } from "./tree/nodes/variables/variableNode";
import { AddNode } from "./tree/nodes/operators/addNode";
import { SubstractNode } from "./tree/nodes/operators/substractNode";
import { EqualNode } from "./tree/nodes/equations/equalNode";
import { ExpNode } from "./tree/nodes/functions/expNode";
import { DivideNode } from "./tree/nodes/operators/divideNode";
import { variance } from "./math/utils/variance";
import { covXYAsNode, covarianceXY } from "./math/utils/covariance";
import { sum } from "./math/utils/sum";

const jsonParser = bodyParser.json();
const mathExercises = Object.values(MathExercises) as Exercise<any>[];
const pcExercises = Object.values(PCExercises) as Exercise<any>[];

const allExercises = [...mathExercises, ...pcExercises];
declare global {
  interface Number {
    toTree: () => AlgebraicNode;
    frenchify: () => string;
    toScientific: (decimals?: number) => AlgebraicNode;
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
Number.prototype.toScientific = function (decimals?: number): AlgebraicNode {
  return toScientific(this.valueOf(), decimals);
};
const runServer = () => {
  dotenv.config();
  const app: Express = express();
  app.use(cors());
  console.log("math exos", mathExercises.length);
  console.log("pc exos", pcExercises.length);
  // const node = new MultiplyNode(
  //   (4).toTree(),
  //   new CosNode(
  //     new MultiplyNode(
  //       new FractionNode(new MultiplyNode((2).toTree(), PiNode), (3).toTree()),
  //       new VariableNode("x"),
  //     ),
  //   ),
  // ).simplify();
  // console.log(node);

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
