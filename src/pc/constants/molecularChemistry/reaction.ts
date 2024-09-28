import { randint } from "#root/math/utils/random/randint";
import { KeyId } from "#root/types/keyIds";
import { Key } from "readline";
import { Molecule, molecules } from "./molecule";

export interface ReactionSpecies {
  coefficient: number;
  species?: Molecule;
}

export abstract class ReactionConstructor {
  static randomReaction(): Reaction {
    const reactionsData = [
      [
        { coefficient: -2, species: "H_2" },
        { coefficient: -2, species: "O_2" },
        { coefficient: 2, species: "H_2O" },
      ],
      [
        { coefficient: -1, species: "CH_4" },
        { coefficient: 2, species: "O_2" },
        { coefficient: 1, species: "CO_2" },
        { coefficient: 2, species: "H_2O" },
      ],
      [
        { coefficient: -2, species: "Mg" },
        { coefficient: -1, species: "O_2" },
        { coefficient: 2, species: "MgO" },
      ],
      [
        { coefficient: -2, species: "H_2O" },
        { coefficient: 2, species: "H_2" },
        { coefficient: 1, species: "O_2" },
      ],
      [
        { coefficient: -4, species: "Fe" },
        { coefficient: -3, species: "O_2" },
        { coefficient: 2, species: "Fe_2O_3" },
      ],
      [
        { coefficient: -1, species: "HCl" },
        { coefficient: -1, species: "NaOH" },
        { coefficient: 1, species: "NaCl" },
        { coefficient: 1, species: "H_2O" },
      ],
      [
        { coefficient: -1, species: "AgNO_3" },
        { coefficient: -1, species: "NaCl" },
        { coefficient: 1, species: "AgCl" },
        { coefficient: 1, species: "NaNO_3" },
      ],
      [
        { coefficient: -1, species: "H_2SO_4" },
        { coefficient: -1, species: "Ca(OH)_2" },
        { coefficient: 1, species: "CaSO_4" },
        { coefficient: 2, species: "H_2O" },
      ],
      [
        { coefficient: -1, species: "C_6H_{12}O_6" },
        { coefficient: 2, species: "C_2H_5OH" },
        { coefficient: 2, species: "CO_2" },
      ],
      [
        { coefficient: -1, species: "C_2H_5OH" },
        { coefficient: -3, species: "O_2" },
        { coefficient: 2, species: "CO_2" },
        { coefficient: 3, species: "H_2O" },
      ],
      [
        { coefficient: -1, species: "CuSO_4" },
        { coefficient: -2, species: "NaOH" },
        { coefficient: 1, species: "Cu(OH)_2" },
        { coefficient: 1, species: "Na_2SO_4" },
      ],
      [
        { coefficient: -1, species: "C_2H_4" },
        { coefficient: -3, species: "O_2" },
        { coefficient: 2, species: "CO_2" },
        { coefficient: 2, species: "H_2O" },
      ],
      [
        { coefficient: -1, species: "Zn" },
        { coefficient: -2, species: "HCl" },
        { coefficient: 1, species: "ZnCl_2" },
        { coefficient: 1, species: "H_2" },
      ],
      [
        { coefficient: -1, species: "H_2SO_4" },
        { coefficient: -2, species: "KOH" },
        { coefficient: 1, species: "K_2SO_4" },
        { coefficient: 2, species: "H_2O" },
      ],
      [
        { coefficient: -2, species: "H_2O_2" },
        { coefficient: 2, species: "H_2O" },
        { coefficient: 1, species: "O_2" },
      ],
      [
        { coefficient: -1, species: "PbCl_2" },
        { coefficient: -2, species: "KI" },
        { coefficient: 1, species: "PbI_2" },
        { coefficient: 2, species: "KCl" },
      ],
      [
        { coefficient: -1, species: "C_3H_8" },
        { coefficient: -5, species: "O_2" },
        { coefficient: 3, species: "CO_2" },
        { coefficient: 4, species: "H_2O" },
      ],
      [
        { coefficient: -1, species: "CH_3COOH" },
        { coefficient: -1, species: "NaOH" },
        { coefficient: 1, species: "CH_3COONa" },
        { coefficient: 1, species: "H_2O" },
      ],
      [
        { coefficient: -1, species: "S" },
        { coefficient: -1, species: "O_2" },
        { coefficient: 1, species: "SO_2" },
      ],
      [
        { coefficient: -1, species: "Ba(NO_3)_2" },
        { coefficient: -1, species: "Na_2SO_4" },
        { coefficient: 1, species: "BaSO_4" },
        { coefficient: 2, species: "NaNO_3" },
      ],
      [
        { coefficient: -1, species: "C_4H_{10}" },
        { coefficient: -6, species: "O_2" },
        { coefficient: 4, species: "CO_2" },
        { coefficient: 5, species: "H_2O" },
      ],
      [
        { coefficient: -1, species: "Cu" },
        { coefficient: -2, species: "AgNO_3" },
        { coefficient: 1, species: "Cu(NO_3)_2" },
        { coefficient: 2, species: "Ag" },
      ],
      [
        { coefficient: -2, species: "HCl" },
        { coefficient: -1, species: "Mg(OH)_2" },
        { coefficient: 1, species: "MgCl_2" },
        { coefficient: 2, species: "H_2O" },
      ],
      [
        { coefficient: -2, species: "KClO_3" },
        { coefficient: 2, species: "KCl" },
        { coefficient: 3, species: "O_2" },
      ],
      [
        { coefficient: -1, species: "PbSO_4" },
        { coefficient: -2, species: "NaCl" },
        { coefficient: 1, species: "PbCl_2" },
        { coefficient: 1, species: "Na_2SO_4" },
      ],
      [
        { coefficient: -1, species: "NH_4NO_3" },
        { coefficient: -1, species: "NaCl" },
        { coefficient: 1, species: "NH_4Cl" },
        { coefficient: 1, species: "NaNO_3" },
      ],
      [
        { coefficient: -2, species: "H_3PO_4" },
        { coefficient: -3, species: "Ca(OH)_2" },
        { coefficient: 1, species: "Ca_3(PO_4)_2" },
        { coefficient: 6, species: "H_2O" },
      ],
      [
        { coefficient: -1, species: "S_8" },
        { coefficient: -8, species: "O_2" },
        { coefficient: 8, species: "SO_2" },
      ],
      [
        { coefficient: -1, species: "AgNO_3" },
        { coefficient: -1, species: "KCl" },
        { coefficient: 1, species: "AgCl" },
        { coefficient: 1, species: "KNO_3" },
      ],
      [
        { coefficient: -1, species: "N_2" },
        { coefficient: -3, species: "H_2" },
        { coefficient: 2, species: "NH_3" },
      ],
      [
        { coefficient: -1, species: "C_6H_{12}O_6" },
        { coefficient: -6, species: "O_2" },
        { coefficient: 6, species: "CO_2" },
        { coefficient: 6, species: "H_2O" },
      ],
      [
        { coefficient: -1, species: "H_2SO_4" },
        { coefficient: -2, species: "NaOH" },
        { coefficient: 1, species: "Na_2SO_4" },
        { coefficient: 2, species: "H_2O" },
      ],
      [
        { coefficient: -1, species: "Pb(NO_3)_2" },
        { coefficient: -1, species: "Na_2SO_4" },
        { coefficient: 1, species: "PbSO_4" },
        { coefficient: 2, species: "NaNO_3" },
      ],
      [
        { coefficient: -1, species: "CaCO_3" },
        { coefficient: 1, species: "CaO" },
        { coefficient: 1, species: "CO_2" },
      ],
      [
        { coefficient: -1, species: "Fe" },
        { coefficient: -1, species: "CuCl_2" },
        { coefficient: 1, species: "Cu" },
        { coefficient: 1, species: "FeCl_2" },
      ],
      [
        { coefficient: -1, species: "H_2" },
        { coefficient: -1, species: "Cl_2" },
        { coefficient: 2, species: "HCl" },
      ],
      [
        { coefficient: -2, species: "AgNO_3" },
        { coefficient: -1, species: "NaCl" },
        { coefficient: 1, species: "AgCl" },
        { coefficient: 1, species: "NaNO_3" },
      ],
      [
        { coefficient: -1, species: "NH_4NO_3" },
        { coefficient: 1, species: "N_2O" },
        { coefficient: 2, species: "H_2O" },
      ],
      [
        { coefficient: -1, species: "S" },
        { coefficient: -1, species: "O_2" },
        { coefficient: 1, species: "SO_2" },
      ],
      [
        { coefficient: -1, species: "PbSO_4" },
        { coefficient: -1, species: "Na_2SO_4" },
        { coefficient: 1, species: "PbSO_4" },
        { coefficient: 2, species: "NaNO_3" },
      ],
      [
        { coefficient: -1, species: "N_2O_4" },
        { coefficient: 2, species: "NO_2" },
      ],
      [
        { coefficient: -2, species: "C_4H_{10}" },
        { coefficient: -13, species: "O_2" },
        { coefficient: 8, species: "CO_2" },
        { coefficient: 10, species: "H_2O" },
      ],
      [
        { coefficient: -2, species: "AgNO_3" },
        { coefficient: -1, species: "Cu" },
        { coefficient: 1, species: "Cu(NO_3)_2" },
        { coefficient: 2, species: "Ag" },
      ],
      [
        { coefficient: -1, species: "C_6H_{12}O_6" },
        { coefficient: -6, species: "O_2" },
        { coefficient: 6, species: "CO_2" },
        { coefficient: 6, species: "H_2O" },
      ],
      [
        { coefficient: -1, species: "Zn" },
        { coefficient: -1, species: "H_2SO_4" },
        { coefficient: 1, species: "ZnSO_4" },
        { coefficient: 1, species: "H_2" },
      ],
      [
        { coefficient: -1, species: "Na_2CO_3" },
        { coefficient: 1, species: "Na_2O" },
        { coefficient: 1, species: "CO_2" },
      ],
      [
        { coefficient: -4, species: "NH_3" },
        { coefficient: -5, species: "O_2" },
        { coefficient: 4, species: "NO" },
        { coefficient: 6, species: "H_2O" },
      ],
      [
        { coefficient: -4, species: "CO" },
        { coefficient: -1, species: "Fe_3O_4" },
        { coefficient: 4, species: "CO_2" },
        { coefficient: 3, species: "Fe" },
      ],
      [
        { coefficient: -1, species: "Cu_2S" },
        { coefficient: -2, species: "Cu_2O" },
        { coefficient: 6, species: "Cu" },
        { coefficient: 1, species: "SO_2" },
      ],
      [
        { coefficient: -1, species: "CH_4" },
        { coefficient: -2, species: "H_2O" },
        { coefficient: 1, species: "CO_2" },
        { coefficient: 4, species: "H_2" },
      ],
      [
        { coefficient: -2, species: "NaCl" },
        { coefficient: -1, species: "H_2SO_4" },
        { coefficient: 2, species: "HCl" },
        { coefficient: 1, species: "Na_2SO_4" },
      ],
      [
        { coefficient: -1, species: "H_2SO_4" },
        { coefficient: -2, species: "H_2O" },
        { coefficient: 2, species: "H_3O^+" },
        { coefficient: 1, species: "SO_4^{2-}" },
      ],
      [
        { coefficient: -1, species: "Fe" },
        { coefficient: -2, species: "H_3O^+" },
        { coefficient: 1, species: "Fe^{2+}" },
        { coefficient: 1, species: "H_2" },
        { coefficient: 1, species: "H_2O" },
      ],
      [
        { coefficient: -1, species: "Cu^{2+}" },
        { coefficient: -2, species: "OH^-" },
        { coefficient: 1, species: "Cu(OH)_2" },
      ],
      [
        { coefficient: -3, species: "Ag^+" },
        { coefficient: -1, species: "PO_4^{3-}" },
        { coefficient: 1, species: "Ag_3PO_4" },
      ],
    ];

    for (const reaction of reactionsData) {
      for (const reactionSpecies of reaction) {
        const foundMolecule = molecules.find(
          (molecule) => molecule.formula === reactionSpecies.species,
        );

        if (!foundMolecule) {
          // console.log(
          //   `La species '${reactionSpecies.species}' n'a pas été trouvée dans molecules.`,
          // );
        }
      }
    }

    const selectedReaction = reactionsData[randint(0, reactionsData.length)];

    return new Reaction(
      selectedReaction.map((el) => {
        return {
          coefficient: el.coefficient,
          species: molecules.find((m) => m.formula === el.species),
        };
      }),
    );
  }
}

export class Reaction {
  reactionArray: ReactionSpecies[];

  constructor(reactionArray: ReactionSpecies[]) {
    this.reactionArray = reactionArray;
  }

  private getReactants(): ReactionSpecies[] {
    return this.reactionArray.filter((r) => r.coefficient < 0);
  }

  private getProducts(): ReactionSpecies[] {
    return this.reactionArray.filter((r) => r.coefficient > 0);
  }

  private formatReactionPart(reactionPart: ReactionSpecies[]): string {
    return reactionPart
      .map((r) => {
        const coefficient =
          Math.abs(r.coefficient) === 1 ? "" : Math.abs(r.coefficient);
        return `${coefficient} ${r.species?.formula}`;
      })
      .join(" + ");
  }

  getReactionString(): string {
    const reactants = this.getReactants();
    const products = this.getProducts();

    const reactantsString = this.formatReactionPart(reactants);
    const productsString = this.formatReactionPart(products);

    return `${reactantsString} \\rightarrow ${productsString}`;
  }

  getReactionWithoutCoef(): string {
    const reactants = this.getReactants();
    const products = this.getProducts();

    const reactantsString = reactants
      .map((r) => `? ${r.species?.formula}`)
      .join(" + ");
    const productsString = products
      .map((r) => `? ${r.species?.formula}`)
      .join(" + ");

    return `$${reactantsString} \\rightarrow ${productsString}$`;
  }

  getReactionWithWrongCoef(): string {
    const reactants = this.getReactants();
    const products = this.getProducts();

    const reactantsString = reactants
      .map(
        (r, index) =>
          `${this.getRandomCoefficient()[index]} ${r.species?.formula}`,
      )
      .join(" + ");
    const productsString = products
      .map(
        (r, index) =>
          `${this.getRandomCoefficient()[index + reactants.length]} ${
            r.species?.formula
          }`,
      )
      .join(" + ");

    return `${reactantsString} \\rightarrow ${productsString}`;
  }

  private getRandomCoefficient(maxRange: number = 6): number[] {
    const myReactionCoef = this.reactionArray.map(
      (species) => species.coefficient,
    );
    const randomCoefs: any[] = [];
    let verif = true;

    while (verif) {
      for (let i = 0; i < myReactionCoef.length; i++) {
        const randomCoef = Math.floor(Math.random() * maxRange) + 1;
        randomCoefs.push(randomCoef === 1 ? "" : randomCoef);
      }

      for (let i = 0; i < myReactionCoef.length - 1; i++)
        if (
          myReactionCoef[i] / randomCoefs[i] !==
          myReactionCoef[i + 1] / randomCoefs[i + 1]
        )
          verif = false;
    }

    return randomCoefs;
  }

  getReactionWithQuestionMark(specieIndexWithQuestionMark: number): string {
    const reactants = this.getReactants();
    const products = this.getProducts();
    let reactantsString, productsString;

    if (specieIndexWithQuestionMark >= reactants.length) {
      reactantsString = this.formatReactionPart(reactants);
      productsString = products
        .map((r, index) => {
          const coefficient =
            Math.abs(r.coefficient) === 1 ? "" : Math.abs(r.coefficient);
          return index + reactants.length === specieIndexWithQuestionMark
            ? "\\ ?"
            : `${coefficient} ${r.species?.formula}`;
        })
        .join(" + ");
    } else {
      reactantsString = reactants
        .map((r, index) => {
          const coefficient =
            Math.abs(r.coefficient) === 1 ? "" : Math.abs(r.coefficient);
          return index === specieIndexWithQuestionMark
            ? "\\ ?"
            : `${coefficient} ${r.species?.formula}`;
        })
        .join(" + ");
      productsString = this.formatReactionPart(products);
    }

    return `$${reactantsString} \\rightarrow ${productsString}$`;
  }

  getUniqueAtomNames(): KeyId[] {
    const uniqueAtomNames = new Set<KeyId>();

    for (const reactionSpecies of this.reactionArray) {
      if (reactionSpecies.species) {
        for (const atomData of reactionSpecies.species.atoms) {
          uniqueAtomNames.add(atomData.atom.name);
        }
      }
    }

    return Array.from(uniqueAtomNames);
  }

  getSpeciesFormula(): string[] {
    const speciesFormula: string[] = [];

    for (const reactionSpecies of this.reactionArray) {
      if (reactionSpecies.species) {
        speciesFormula.push(reactionSpecies.species.formula);
      }
    }

    return speciesFormula;
  }
  getSpeciesName(): string[] {
    const speciesFormula: string[] = [];

    for (const reactionSpecies of this.reactionArray) {
      if (reactionSpecies.species) {
        speciesFormula.push(reactionSpecies.species.name);
      }
    }

    return speciesFormula;
  }
  getKeyIds(): KeyId[] {
    const speciesFormula: KeyId[] = [];

    for (const reactionSpecies of this.reactionArray) {
      if (reactionSpecies.species) {
        speciesFormula.push(reactionSpecies.species.keyId);
      }
    }

    return speciesFormula;
  }
}
export { molecules };
