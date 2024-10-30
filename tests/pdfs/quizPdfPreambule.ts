export const quizPdfPreambule = () => {
  return `\\documentclass[a4paper, 8pt]{article}
\\usepackage[dvipsnames]{xcolor}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{arev}
\\usepackage[left=1cm, right=1cm, top=1cm, bottom=1cm,includehead,includefoot]{geometry}
\\usepackage{eurosym}
\\usepackage{amstext} 
\\DeclareRobustCommand{\\officialeuro}{%
  \\ifmmode\\expandafter\\text\\fi
  {\\fontencoding{U}\\fontfamily{eurosym}\\selectfont e}}

\\usepackage{robust-externalize}
\\usepackage{amsmath}
\\usepackage{multicol}
\\usepackage{qrcode}
\\usepackage{listings}
\\usepackage{hyperref}
\\usepackage{tikz}
\\usepackage{amssymb}
\\usepackage{fancyhdr}

\\newenvironment{tightcenter}{%
  \\setlength\\topsep{0pt}
  \\setlength\\parskip{0pt}
  \\begin{center}
}{%
  \\end{center}
}

\\pagestyle{fancy}

\\definecolor{codegreen}{rgb}{0,0.6,0}
\\definecolor{codegray}{rgb}{0.5,0.5,0.5}
\\definecolor{codepurple}{rgb}{0.58,0,0.82}
\\definecolor{backcolour}{rgb}{0.95,0.95,0.92}
 
\\lstdefinestyle{mystyle}{
    backgroundcolor=\\color{backcolour},   
    commentstyle=\\color{codegreen},
    keywordstyle=\\color{magenta},
    numberstyle=\\tiny\\color{codegray},
    stringstyle=\\color{codepurple},
    basicstyle=\\footnotesize,
    breakatwhitespace=false,         
    breaklines=true,                 
    captionpos=b,                    
    keepspaces=true,                 
    numbers=left,                    
    numbersep=5pt,                  
    showspaces=false,                
    showstringspaces=false,
    showtabs=false,                  
    tabsize=2,
    xleftmargin=2em
}

\\setlength\\parindent{0pt}
\\setlength{\\columnseprule}{0.5pt} 
\\lstset{style=mystyle}

\\newenvironment{correctionColored}{\\par\\color{RoyalBlue}}{\\par}

\\begin{document}
\\lstset{language=Python}
%\\fancyhead{}
%\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0.4pt}
\\renewcommand{\\footruleskip}{2pt}

`;
};
