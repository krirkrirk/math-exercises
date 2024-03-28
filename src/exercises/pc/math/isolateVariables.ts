import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
import { KeyId } from "#root/types/keyIds";
import { random } from "#root/utils/random";

type Identifiers = {
  formulaType: number;
  varAsked: string;
};

// m = t*v
// P = m*g
// v = d/t
// U = RI
// F = t_m / t_f
// F = V_f / V_m
// t_m/t_f = V_f/V_m
const formulas = [];
const getIsolateVariablesQuestion: QuestionGenerator<Identifiers> = () => {
  let varAsked = "";
  let answer = "";
  const formulaType = randint(1, 8);
  let formulaAsked = "";
  let vars: string[] = [];
  let formulas: string[] = [];
  switch (formulaType) {
    case 1:
      vars = ["m", "t", "v"];
      formulas = ["m=tv", "t=\\frac{m}{v}", "v=\\frac{m}{t}"];
      varAsked = random(vars);
      answer = formulas.find((el) => el[0] === varAsked)!;
      formulaAsked = random(formulas.filter((el) => el[0] !== varAsked));
      break;
    case 2:
      vars = ["P", "m", "g"];
      formulas = ["P=mg", "m=\\frac{P}{g}", "g=\\frac{P}{m}"];
      varAsked = random(vars);
      answer = formulas.find((el) => el[0] === varAsked)!;
      formulaAsked = random(formulas.filter((el) => el[0] !== varAsked));
      break;
    case 3:
      vars = ["U", "R", "I"];
      formulas = ["U=RI", "R=\\frac{U}{I}", "I=\\frac{U}{R}"];
      varAsked = random(vars);
      answer = formulas.find((el) => el[0] === varAsked)!;
      formulaAsked = random(formulas.filter((el) => el[0] !== varAsked));
      break;
    case 4:
      vars = ["v", "d", "t"];
      formulas = ["v=\\frac{d}{t}", "d=vt", "t=\\frac{d}{v}"];
      varAsked = random(vars);
      answer = formulas.find((el) => el[0] === varAsked)!;
      formulaAsked = random(formulas.filter((el) => el[0] !== varAsked));
      break;
    case 5:
      vars = ["F", "t_m", "t_f"];
      formulas = ["F=\\frac{t_m}{t_f}", "t_m=Ft_f", "t_f=\\frac{t_m}{F}"];
      varAsked = random(vars);
      answer = formulas.find((el) => el.split("=")[0] === varAsked)!;
      formulaAsked = random(
        formulas.filter((el) => el.split("=")[0] !== varAsked),
      );
      break;
    case 6:
      vars = ["F", "V_m", "V_f"];
      formulas = ["F=\\frac{V_f}{V_m}", "V_m=\\frac{V_f}{F}", "V_f=FV_m"];
      varAsked = random(vars);
      answer = formulas.find((el) => el.split("=")[0] === varAsked)!;
      formulaAsked = random(
        formulas.filter((el) => el.split("=")[0] !== varAsked),
      );
      break;
    case 7:
      vars = ["t_m", "t_f", "V_m", "V_f"];
      formulas = ["\\frac{t_m}{t_f}=\\frac{V_f}{V_m}", "t_mV_m=t_fV_f"];
      varAsked = random(vars);
      answer =
        varAsked === "t_m"
          ? "t_m=\\frac{V_ft_f}{V_m}"
          : varAsked === "t_f"
          ? "t_f=\\frac{t_mV_m}{t_f}"
          : varAsked === "V_m"
          ? "V_m=\\frac{t_fV_f}{t_m}"
          : "V_f=\\frac{t_mV_m}{t_f}";
      formulaAsked = random(formulas);
      break;
  }
  const keys = [
    "equal",
    ...vars.map((v) =>
      v === "V_f"
        ? "volumeFille"
        : v === "V_m"
        ? "volumeMere"
        : v === "t_f"
        ? "concentrationFille"
        : v === "t_m"
        ? "concentrationMere"
        : v,
    ),
  ] as KeyId[];
  const question: Question<Identifiers> = {
    answer,
    instruction: `Isoler la grandeur $${varAsked}$ dans l'expression suivante : $${formulaAsked}$`,
    keys: keys,
    answerFormat: "tex",
    identifiers: { varAsked, formulaType },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, formulaType, varAsked },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  switch (formulaType) {
    case 1:
      if (varAsked === "m") {
        tryToAddWrongProp(propositions, "m=\\frac{t}{v}");
        tryToAddWrongProp(propositions, "m=\\frac{v}{t}");
        tryToAddWrongProp(propositions, "m=t+v");
      }
      if (varAsked === "t") {
        tryToAddWrongProp(propositions, "t=\\frac{v}{m}");
        tryToAddWrongProp(propositions, "t=mv");
        tryToAddWrongProp(propositions, "t=m-v");
      }
      if (varAsked === "v") {
        tryToAddWrongProp(propositions, "v=\\frac{t}{m}");
        tryToAddWrongProp(propositions, "v=mt");
        tryToAddWrongProp(propositions, "v=m-t");
      }
      break;
    case 2:
      if (varAsked === "P") {
        tryToAddWrongProp(propositions, "P=\\frac{m}{g}");
        tryToAddWrongProp(propositions, "P=\\frac{g}{m}");
        tryToAddWrongProp(propositions, "P=m+g");
      }
      if (varAsked === "m") {
        tryToAddWrongProp(propositions, "m=\\frac{g}{P}");
        tryToAddWrongProp(propositions, "m=Pg");
        tryToAddWrongProp(propositions, "m=P-g");
      }
      if (varAsked === "g") {
        tryToAddWrongProp(propositions, "g=\\frac{m}{P}");
        tryToAddWrongProp(propositions, "g=Pm");
        tryToAddWrongProp(propositions, "g=P-m");
      }
      break;
    case 3:
      if (varAsked === "U") {
        tryToAddWrongProp(propositions, "U=\\frac{R}{I}");
        tryToAddWrongProp(propositions, "U=\\frac{I}{R}");
        tryToAddWrongProp(propositions, "U=R+I");
      }
      if (varAsked === "R") {
        tryToAddWrongProp(propositions, "R=\\frac{I}{U}");
        tryToAddWrongProp(propositions, "R=UI");
        tryToAddWrongProp(propositions, "R=U-I");
      }
      if (varAsked === "I") {
        tryToAddWrongProp(propositions, "I=\\frac{R}{U}");
        tryToAddWrongProp(propositions, "I=RU");
        tryToAddWrongProp(propositions, "I=U-R");
      }
      break;
    case 4:
      if (varAsked === "v") {
        tryToAddWrongProp(propositions, "v=\\frac{t}{d}");
        tryToAddWrongProp(propositions, "v=dt");
        tryToAddWrongProp(propositions, "v=d+t");
      }
      if (varAsked === "d") {
        tryToAddWrongProp(propositions, "d=\\frac{t}{v}");
        tryToAddWrongProp(propositions, "d=\\frac{v}{t}");
        tryToAddWrongProp(propositions, "d=v+t");
      }
      if (varAsked === "t") {
        tryToAddWrongProp(propositions, "t=\\frac{v}{d}");
        tryToAddWrongProp(propositions, "t=vd");
        tryToAddWrongProp(propositions, "t=v+d");
      }
      break;
    case 5:
      //F = t_m / t_f
      if (varAsked === "F") {
        tryToAddWrongProp(propositions, "F=\\frac{t_f}{t_m}");
        tryToAddWrongProp(propositions, "F=t_mt_f");
        tryToAddWrongProp(propositions, "F=t_f+t_m");
      }
      if (varAsked === "t_m") {
        tryToAddWrongProp(propositions, "t_m=\\frac{F}{t_f}");
        tryToAddWrongProp(propositions, "t_m=\\frac{t_f}{F}");
        tryToAddWrongProp(propositions, "t_m=F+t_f");
      }
      if (varAsked === "t_f") {
        tryToAddWrongProp(propositions, "t_f=\\frac{F}{t_m}");
        tryToAddWrongProp(propositions, "t_f=Ft_m");
        tryToAddWrongProp(propositions, "t_f=F+t_m");
      }
      break;
    case 6:
      //F = V_f / V_m
      if (varAsked === "F") {
        tryToAddWrongProp(propositions, "F=\\frac{V_m}{V_f}");
        tryToAddWrongProp(propositions, "F=V_mV_f");
        tryToAddWrongProp(propositions, "F=V_f+V_m");
      }
      if (varAsked === "V_f") {
        tryToAddWrongProp(propositions, "V_f=\\frac{F}{V_m}");
        tryToAddWrongProp(propositions, "V_f=\\frac{V_m}{F}");
        tryToAddWrongProp(propositions, "V_f=F+V_m");
      }
      if (varAsked === "V_m") {
        tryToAddWrongProp(propositions, "V_m=\\frac{F}{V_f}");
        tryToAddWrongProp(propositions, "V_m=FV_f");
        tryToAddWrongProp(propositions, "V_m=F+V_f");
      }
      break;
    case 7:
      //t_mV_m = V_f t_f
      if (varAsked === "t_m") {
        tryToAddWrongProp(propositions, "t_m=\\frac{V_f}{V_mt_f}");
        tryToAddWrongProp(propositions, "t_m=\\frac{V_fV_m}{t_f}");
        tryToAddWrongProp(propositions, "t_m=\\frac{V_mt_f}{V_f}");
      }
      if (varAsked === "V_f") {
        tryToAddWrongProp(propositions, "V_f=\\frac{t_m}{t_fV_m}");
        tryToAddWrongProp(propositions, "V_f=\\frac{t_mt_f}{V_m}");
        tryToAddWrongProp(propositions, "V_f=\\frac{t_fV_m}{t_m}");
      }
      if (varAsked === "V_m") {
        tryToAddWrongProp(propositions, "V_m=\\frac{t_m}{V_ft_f}");
        tryToAddWrongProp(propositions, "V_m=\\frac{V_ft_m}{t_f}");
        tryToAddWrongProp(propositions, "V_m=\\frac{V_f}{t_mt_f}");
      }
      if (varAsked === "t_f") {
        tryToAddWrongProp(propositions, "t_f=\\frac{V_m}{V_ft_m}");
        tryToAddWrongProp(propositions, "t_f=\\frac{V_fV_m}{t_m}");
        tryToAddWrongProp(propositions, "t_f=\\frac{V_f}{V_mt_m}");
      }
      break;
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, formulaType, varAsked },
) => {
  const texs = [answer];
  switch (formulaType) {
    case 1:
      // formulas = ["m=t\\times v", "t=\\frac{m}{v}", "v=\\frac{m}{t}"];
      if (varAsked === "m") texs.push("m=vt");
      break;
    case 2:
      // formulas = ["P=m\\times g", "m=\\frac{P}{g}", "g=\\frac{P}{m}"];
      if (varAsked === "P") texs.push("P=gm");
      break;
    case 3:
      // formulas = ["U=R\\times I", "R=\\frac{U}{I}", "I=\\frac{U}{R}"];
      if (varAsked === "U") texs.push("U=IR");
      break;
    case 4:
      // formulas = ["v=\\frac{d}{t}", "d=v\\times t", "t=\\frac{d}{v}"];
      if (varAsked === "d") texs.push("d=tv");
      break;
    case 5:
      // formulas = [
      //   "F=\\frac{t_m}{t_f}",
      //   "t_m=F\\times t_f",
      //   "t_f=\\frac{t_m}{F}",
      // ];
      if (varAsked === "t_m") texs.push("t_m=t_fF");
      break;
    case 6:
      // formulas = [
      //   "F=\\frac{V_f}{V_m}",
      //   "V_m=\\frac{V_f}{F}",
      //   "V_f=F\\times V_m",
      // ];
      if (varAsked === "V_f") texs.push("V_f=V_mF");
      break;
    case 7:
      // formulas = ["\\frac{t_m}{t_f}=\\frac{V_f}{V_m}", "t_mV_m = t_fV_f"];
      if (varAsked === "t_m") texs.push("t_m=\\frac{t_fV_f}{V_m}");
      if (varAsked === "t_f") texs.push("t_f=\\frac{V_mt_m}{t_f}");
      if (varAsked === "V_m") texs.push("V_m=\\frac{V_ft_f}{t_m}");
      if (varAsked === "V_f") texs.push("V_f=\\frac{V_mt_m}{t_f}");
      break;
  }
  return texs.includes(ans) || texs.includes(ans.replace("\\times ", ""));
};
export const isolateVariables: Exercise<Identifiers> = {
  id: "isolateVariables",
  connector: "=",
  label: "Isoler une grandeur",
  levels: ["2nde"],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getIsolateVariablesQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
};
