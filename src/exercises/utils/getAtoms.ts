import { atomes } from "#root/pc/molecularChemistry/atome";

const lineLastElements = ["He", "Ne", "Ar", "Kr", "Xe", "Rn", "Og"];

export const getAtoms = (numberOfPeriodicTableLines?: number) => {
  if (!numberOfPeriodicTableLines) return atomes;
  return atomes.slice(
    0,
    atomes.findIndex(
      (a) => a.symbole === lineLastElements[numberOfPeriodicTableLines - 1],
    ) + 1,
  );
};
