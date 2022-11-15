export interface MathSetInterface<T> {
  tex: string;
  getRandomElement: () => T;
  //   constructor(tex: string, getRandomElement: () => number) {
  //     this.tex = tex;
  //     this.getRandomElement = getRandomElement;
  //   }
}
