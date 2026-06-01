English [简体中文](README.zh-cn.md)

# ST-Calc

A math calculator extension for SillyTavern

register a Function Tool for LLMs to count right

## TL;DR

1. Install [ST-Calc](https://github.com/Pigeonszz/ST-Calc)
2. `Enable function calling` in your chat completion preset
3. Remind the LLM to use the `calculate` tool in the system prompt
4. (Optional) Install [Extension-LaTeX](https://github.com/SillyTavern/Extension-LaTeX) with relevant regex for LaTeX rendering

## Notes

1. Each tool call counts as one request (text output vs. tool call output are treated differently)
2. Due to a SillyTavern bug ([issue #5532](https://github.com/SillyTavern/SillyTavern/issues/5532), [PR #5545](https://github.com/SillyTavern/SillyTavern/pull/5545)), DeepSeek models currently do not support function calling

## Features

1. Multiple calculations in a single call
2. Chained references to previous results via `[N].result`

Supported operations:

```plaintext
Arithmetic: + - * / % ^ **
Trigonometry: sin/cos/tan/asin/acos/atan
Logarithms: log/log10/log2
Exponential: exp
Square root: sqrt/nthRoot
Rounding: ceil/floor/round
Absolute value: abs
Max/Min: max/min
Derivative: derivative
Determinant: det
Inverse matrix: inv
Eigenvalues: eigs
Matrix transpose: transpose
Constants: pi (PI), e, i (imaginary unit), Infinity
```

## Debug

Type `/tools-list` in the chat input to see all registered tools.

## Acknowledgements

[mathjs](https://github.com/josdejong/mathjs)

DeepSeek V4 Pro
