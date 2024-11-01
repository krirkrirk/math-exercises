export class GeogebraParser {
  commands: string[];
  constructor(studentCommands: string[]) {
    this.commands = studentCommands;
  }

  pointCoords(name: string) {
    const command = this.commands.find((c) => c.includes(name + "="));
    if (!command) return;
    const coords = command.split("=")[1];
    const [x, y] = coords
      .replace("(", "")
      .replace(")", "")
      .split(",")
      .map(parseFloat);
    return [x, y];
  }
  vectors() {
    //regex find string that starts with a undercase letter and then =vector
    const res: number[][] = [];
    const vectors = this.commands.filter(
      (cmd) => !!cmd.match(/^[a-z]=Vector/)?.length,
    );
    if (!vectors) return [];
    for (const vector of vectors) {
      const pointCoords: number[][] = [];
      let command = vector.split("=Vector")[1];
      command.replace("]", "").replace("[", "").replaceAll(" ", "");
      let pointMatch = command.match(/[A-Z]|\(\d+(\.\d+)?,\s*\d+(\.\d+)?\)/);

      while (pointMatch?.length) {
        const name = pointMatch[0];
        if (name.match(/[A-Z]/)?.length) {
          const point = this.pointCoords(name);
          if (point) pointCoords.push(point);
        } else {
          //point is (xxx,yyy)
          const [x, y] = name
            .replace("(", "")
            .replace(")", "")
            .split(",")
            .map(parseFloat);
          pointCoords.push([x, y]);
        }
        command = command.substring(pointMatch.index! + 1);
        pointMatch = command.match(/[A-Z]|\(\d+(\.\d+)?,\s*\d+(\.\d+)?\)/);
      }
      res.push([
        pointCoords[1][0] - pointCoords[0][0],
        pointCoords[1][1] - pointCoords[0][1],
      ]);
    }
    return res;
  }
}
