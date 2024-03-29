const electronsShells = [
  { label: "1s", possibleNumberOfElectrons: 1 },
  { label: "2s", possibleNumberOfElectrons: 2 },
  { label: "2p", possibleNumberOfElectrons: 2 },
  { label: "3s", possibleNumberOfElectrons: 3 },
  { label: "3p", possibleNumberOfElectrons: 3 },
];

export const getElectronicConfigurationFromShells = (shells: number[]) => {
  //get [2, 2, 6, 2, 6],
  //return 1s^2 2s^2 2p^6 3s^2 3p^6
  const tex = shells
    .map((shell, index) => electronsShells[index].label + "^" + shell)
    .join("\\ ");
  return tex;
};
