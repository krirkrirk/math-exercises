/**
 * supprime les éléments superflus sans aucun calcul maths
 * ex : transforme (2) en 2
 * ex : transforme (9)/3 en 9/3 mais pas en 3
 * doit-il transformer 1*x en x ?
 * @param str réponse élève
 */
export const purifyLatex = (str: string) => {
  //on peut supprimer des parenthèses si :
  //* pas suivi/précédé d'une multiplication
  //* pas arguments d'une fonction
  //* .. ?
};
