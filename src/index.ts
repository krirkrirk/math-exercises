import { exercises } from "./exercises/exercises";
import { NumberNode } from "./tree/nodes/numbers/numberNode";
import { AddNode } from "./tree/nodes/operators/addNode";

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
 * !!!current vea : reciprocal percentge

*/

export { exercises };
