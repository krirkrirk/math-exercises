export class GeogebraConstructor {
  commands: string[] = [];

  constructor() {}

  addCommand(...s: string[]) {
    this.commands.push(...s);
  }
  getCommands() {
    return this.commands;
  }
}
