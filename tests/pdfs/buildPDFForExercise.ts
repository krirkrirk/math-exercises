import { quizPdfPreambule } from "./quizPdfPreambule";
import { quizPdfHeader } from "./quizPdfHeader";
import { formatMarkdownToLatex } from "./formatMdToLatex";
import { v4 } from "uuid";
// import { activities } from "../src/resolvers/activity/query/activities";
// import { activities } from "@root/resolvers/activity/query/activities";
import fs from "fs";
import latex from "node-latex";
import { Exercise, Proposition, Question } from "../../src/exercises/exercise";

export const buildPdfForExercise = (exo: Exercise) => {
  const exoShortName = exo.id;
  const preambule = quizPdfPreambule();
  const questions = exo.generator(10);

  const header = quizPdfHeader({
    title: exoShortName,
    isCorrection: true,
  });
  let content = "";

  questions.forEach((question, index) => {
    let propositions: Proposition[] = [];
    content += `\n\n \\textbf{Question ${index + 1}} \n\n`;
    const imgRegex = /!\[.*?\]\((.*?)\)/g;
    const matches = question.instruction.matchAll(imgRegex);
    for (const match of matches) {
      question.instruction = question.instruction.replace(match[0], ``);
    }
    const formatted = formatMarkdownToLatex(question.instruction);
    content += `
      ${formatted} \n
      `;

    if (exo.answerType !== "GGB") {
      propositions = exo.getPropositions!(4, {
        answer: question.answer!,
        ...question.identifiers,
      });
      const shouldSpread = exo.pdfOptions?.shouldSpreadPropositions;
      if (!shouldSpread)
        content += `
          \\setlength{\\columnseprule}{0pt} 
          \\begin{multicols}{2}
          `;
      const letters = ["A", "B", "C", "D"];
      propositions.forEach((proposition, index) => {
        const format = proposition.format;
        if (format === "raw") {
          content += `\\textit{${letters[index]})} \\quad ${proposition.statement} \n\n`;
        } else {
          content += `\\textit{${letters[index]})} \\quad $${proposition.statement}$ \n\n`;
        }
        if (!shouldSpread && (index === 0 || index === 2))
          content += "\\vspace{0.2cm}";
        if (!shouldSpread && index === 1) content += "\\columnbreak";
      });

      if (!shouldSpread)
        content += `
        \\end{multicols}
        \\setlength{\\columnseprule}{0.5pt} 
        
        `;
    }
    content += "\\begin{correctionColored}";
    content += "\\textbf{Correction : } ";
    if (question.correction) {
      content += formatMarkdownToLatex(question.correction);
    } else {
      if (exo.answerType === "GGB") {
        content += "Correction GGB";
      } else {
        const answers = propositions.filter((prop) => prop.isRightAnswer);
        answers?.forEach((ans) => {
          content +=
            ans.format === "raw" ? ans.statement : `$${ans.statement}$`;
        });
      }
    }

    content += "\\end{correctionColored}";
    content += "{\\color{lightgray}\\par\\hrulefill}";
  });

  const endDocument = `
    \\end{multicols*}
    \\end{document}
    `;

  const file = `${preambule}
  ${header}
  ${content}
  ${endDocument}`;

  fs.appendFileSync(__dirname + `/dump/${exoShortName}.tex`, `${file}`);
  const input = fs.createReadStream(__dirname + `/dump/${exoShortName}.tex`);
  const output = fs.createWriteStream(__dirname + `/dump/${exoShortName}.pdf`);
  const pdf = latex(input, { args: ["-shell-escape"] });

  try {
    pdf.pipe(output);
  } catch (err) {
    console.log("pdf pipe err", exoShortName, err);
    throw err;
  }
  pdf.on("error", async (err) => {
    console.log("pdf err", err, exoShortName);
    // fs.unlink(__dirname + `/dump/${exoShortName}.pdf`, function (err) {});
    // fs.unlink(__dirname + `/dump/${exoShortName}.tex`, function (err) {});
    throw err;
  });
  pdf.on("finish", async () => {});
};
