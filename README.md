# Gpub Example

A full, worked GPub example, both for testing and for documentation.

Steps to create this repo:

**This assumes**

* You have [nodejs](https://nodejs.org/en/) installed
* You have [LaTeX](https://www.latex-project.org/) installed
* You installed the [go-type1](https://github.com/Kashomon/go-type1) fonts

Steps to create a `Book` repo that follows these patterns:

1.  `npm init` -- Initialize the repository (requires installing nodejs/npm)
3.  `npm install gpub-go --save-dev`
4.  Copy an SGF (or SGFs) from somewhere. For this repo, I've largely used SGFs
    from [Go Game
    Guru](https://gogameguru.com/go-commentary-lee-sedol-vs-alphago-game-1/)
5.  Add the relevant scripting to `index.js`. See some example directories for examples.
6.  Run with `node index.js`
7.  Compile a LaTeX book with `pdflatex mybook.tex`
