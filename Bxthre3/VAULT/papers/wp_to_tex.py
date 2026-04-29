#!/usr/bin/env python3
"""Convert BX3 White Paper MD → Zenodo-ready LaTeX"""

import sys, re

WHT = """\\documentclass[12pt]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{amsmath,amssymb,booktabs,array,enumitem}
\\usepackage[numbers,sort&compress]{natbib}
\\usepackage{graphicx,float}
\\usepackage{xcolor,hyperref}
\\usepackage{tikz}
\\usetikzlibrary{shapes.geometric,arrows.meta,positioning}
\\hypersetup{colorlinks=true,linkcolor=blue,citecolor=blue}
"""
WHE = "\\bibliographystyle{plainnat}\\bibliography{references}\\end{document}"

def md_to_tex(md):
    lines = md.split('\n'); out=[]; i=0
    while i<len(lines):
        l=lines[i]
        if l.startswith('# ') and i+1<len(lines) and lines[i+1].startswith('##'): 
            title=lines[i][2:];subtitle=lines[i+1][3:] if i+1<len(lines) else ''
            out.append("\\begin{center}\\LARGE\\textbf{"+title+"}}\\normalsize\\end{center}")
            out.append("\\begin{center}\\large\\textit{"+subtitle+"}:\\end{center}")
            i+=2
        elif l.startswith('## '): out.append("\\section{"+l[3:]+"}")
        elif l.startswith('### '): out.append("\\subsection{"+l[4:]+"}")
        elif l.startswith('#### '): out.append("\\subsubsection{"+l[5:]+"}")
        elif l.startswith('*') and l.endswith('*') and not '**' in l: out.append("\\textit{"+l[1:-1]+"}")
        elif l.startswith('- '): out.append("\\item "+l[2:])
        elif l.startswith('```'): 
            code=[]; i+=1
            while i<len(lines) and not lines[i].startswith('```'): code.append(lines[i]); i+=1
            out.append("\\begin{verbatim}"+"\n".join(code)+"\\end{verbatim}")
        elif '|' in l and '+' in l and '-' in l and l.strip().startswith('|'): pass
        elif l.startswith('|') and not '+' in l:
            parts=[c.strip() for c in l.split('|')[1:-1]]
            if len(parts)>0: out.append("\\textit{"+parts[0]+"}"+(("\\textbf{"+parts[1]+"}") if len(parts)>1 else ''))
        elif l.strip()=='': out.append('')
        else:
            t=l.replace('_','\_').replace('*','').replace('[','(').replace(']',')')
            out.append(t)
        i+=1
    return '\n'.join(out)
