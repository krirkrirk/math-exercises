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
 \\DecimalMathComma

  \\fancyhead[C]{
  \\begin{large}
  ${title}${isCorrection ? " - Corrigé" : ""}
  \\end{large}
  }



\\begin{multicols*}{2}


{
    \\def\\OldComma{,}
    \\catcode\`\\,=13
    \\def,{%
      \\ifmmode%
        \\OldComma\\discretionary{}{}{}%
      \\else%
        \\OldComma%
      \\fi%
    }%
Here is some very long text followed by a very  $a,b,c,d,e,f,g,h,i,j,k,l$ etc.%
}
`;
};
