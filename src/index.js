import { evaluate } from './calc-engine';

const { registerFunctionTool } = SillyTavern.getContext();

registerFunctionTool({
    name: 'calculate',
    displayName: '数学计算器',
    description: [
        '计算一个或多个数学表达式。支持链式引用之前的结果([N].result)，支持高等数学运算。',
        '基础: + - * / % ^ ** 、三角函数(sin/cos/tan/asin/acos/atan)、对数(log/log10/log2)、指数(exp)、',
        '平方根(sqrt/nthRoot)、取整(ceil/floor/round)、绝对值(abs)、最大值(max)/最小值(min)',
        '高等: 导数(derivative)、行列式(det)、逆矩阵(inv)、特征值(eigs)、矩阵转置(transpose)',
        '常量: pi(PI)、e、i(虚数)、Infinity(无穷)',
        '示例: ["2+3*4", "[1].result*2", "sqrt([2].result)"]',
    ].join(' '),
    parameters: {
        $schema: 'http://json-schema.org/draft-04/schema#',
        type: 'object',
        properties: {
            expressions: {
                type: 'array',
                description: [
                    '需要计算的数学表达式数组，按顺序执行。',
                    '可使用 [N].result 引用第 N 条表达式的计算结果(N 从 1 开始)。',
                    '支持赋值: x = 5 (后续表达式可用 x)。',
                    '高等运算: derivative("x^2", "x") 求导, det([[1,2],[3,4]]) 行列式, inv([[1,2],[3,4]]) 逆矩阵。',
                ].join(' '),
                items: {
                    type: 'string',
                    description: '一条数学表达式字符串',
                },
            },
            precision: {
                type: 'integer',
                description: '结果有效位数，默认 15，范围 1-30',
                minimum: 1,
                maximum: 30,
            },
        },
        required: ['expressions'],
    },
    action: async ({ expressions, precision }) => {
        if (!Array.isArray(expressions) || expressions.length === 0) {
            throw new Error('expressions 必须是非空数组');
        }

        const exprList = expressions.map(e => String(e).trim());
        const p = precision ? Math.min(Math.max(parseInt(precision, 10) || 15, 1), 30) : 15;
        const results = evaluate(exprList, p);

        return JSON.stringify(results.map(r => ({
            index: r.index,
            expression: r.expression,
            result: r.display,
        })));
    },
    formatMessage: ({ expressions }) => {
        const count = Array.isArray(expressions) ? expressions.length : 0;
        const preview = Array.isArray(expressions) ? expressions.slice(0, 3).join(', ') : '';
        return `正在计算${count}个表达式: ${preview}${count > 3 ? '...' : ''}`;
    },
});
