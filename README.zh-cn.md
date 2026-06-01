[English](README.md) 简体中文

# ST-Calc

酒馆扩展：数学计算器

注册一个函数工具让大语言模型学会数数

## TL;DR

1. 安装扩展程序[ST-Calc](https://github.com/Pigeonszz/ST-Calc)
2. 在对话补全预设中`启用函数调用`
3. 在提示词中提醒 LLM 使用 `calculate` 工具
4. （可选）安装[Extension-LaTeX](https://github.com/SillyTavern/Extension-LaTeX) 及相关正则以支持LaTex渲染

## 注意事项

1. 一次工具调用等同于一次请求（输出文本和输出工具调用文本的区别）
2. 由于酒馆的bug: [issue #5532](https://github.com/SillyTavern/SillyTavern/issues/5532) [pull #5545](https://github.com/SillyTavern/SillyTavern/pull/5545) ，deepseek 模型暂不支持工具调用

## 功能

1. 一次调用内进行多次运算
2. 链式引用之前的计算结果

支持：

```plaintext
基础运算: + - * / % ^ **
三角函数: sin/cos/tan/asin/acos/atan
对数: log/log10/log2
指数: exp
平方根: sqrt/nthRoot
取整: ceil/floor/round
绝对值: abs
最大值: max / 最小值: min
导数: derivative
行列式: det
逆矩阵: inv
特征值: eigs
矩阵转置: transpose
常量: pi(PI)、e、i(虚数)、Infinity(无穷)
```

## Debug

在聊天框输入 `/tools-list` 查看已注册的工具

## 致谢

[mathjs](https://github.com/josdejong/mathjs)

DeepSeek V4 Pro
