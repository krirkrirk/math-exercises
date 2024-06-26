// import { exercises } from "./exercises/exercises";
import { NumberNode } from "./tree/nodes/numbers/numberNode";
import { AddNode } from "./tree/nodes/operators/addNode";
import * as MathExercises from "./exercises/math";
import * as PCExercises from "./exercises/pc";

import {
  MinusInfinityNode,
  PlusInfinityNode,
} from "./tree/nodes/numbers/infiniteNode";
import { AlgebraicNode } from "./tree/nodes/algebraicNode";
import { toScientific } from "./utils/numberPrototype/toScientific";

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
/**
 * TODO
 * Décimal : permettre facilement -0.xxx
 * Tree shaking export
 * 
 * VEA: 
 *  -> -3x est bien transofmré en -3*x, x*(-3) mais pas en -x*3
 *      ->> faire le meme delire que pour les power mais pour les opposite ? 
 *          c'est à dire créer toutes les permuts en déplacant le moins qquepart
 *  -> faire des nodes pour les Ensembles de nombre
 *  
 * !-> choses pour lesquelles la v1 ne marchera pas : 
 *  !-- fractions non réduites
 *  !-- nbs décimaux avec des 0
 *  !-- nb quelconque de moins, genre -3*-4 ou -x/-y
 * !-> pour ces choses là il faut obligatoirement parser la rpéonse élève ?
 * 
 * Passer les sqrtNode en tree-iable
 * 
 * 
 * 
 * !!!à fix :
 * ! fraction réductible
 * ! 0,20 au lieu de 0,2
 * ! moins partout dans fraction
 * !puissances négatives vers inverse fraction 
 * ! simplification du ln
 * ! meileure gestion des [] : le clavier devriat pouvoir produire des left/right ; 
 *      !aussi en tapant [ puis diviser, le crochet passe en numérateur
 * ! espace tous les 3 chiffres dans un nb (le clavier doit le fournir aussi!) 

*/

const mathExercises = Object.values(MathExercises);
const pcExercises = Object.values(PCExercises);

export { mathExercises, pcExercises };
