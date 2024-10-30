//qrcodes
type Props = {
  soloQuizSessionLink?: string;
  title?: string;
  correctionLink?: string;
  isCorrection?: boolean;
};
export const quizPdfHeader = ({
  title,
  isCorrection,
  correctionLink,
  soloQuizSessionLink,
}: Props) => {
  return `


  \\fancyhead[C]{
  \\begin{large}
  ${title}${isCorrection ? " - Corrigé" : ""}
  \\end{large}
  }



\\begin{multicols*}{2}

`;
};
