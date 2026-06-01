import { evaluate } from './calc-engine';

const { registerFunctionTool } = SillyTavern.getContext();

/**
 * Detect SillyTavern UI language.
 * Checks localStorage (ST i18n setting) → document.documentElement.lang → defaults to 'en'.
 */
function getLanguage() {
    try {
        // SillyTavern stores the user-selected locale in localStorage
        const stored = localStorage.getItem('language');
        if (stored) {
            const lower = stored.toLowerCase();
            if (lower.startsWith('zh')) return 'zh';
            if (lower.startsWith('en')) return 'en';
        }
    } catch (_) { /* localStorage unavailable */ }

    try {
        // document.documentElement.lang is set by ST to current locale (e.g. "zh-cn", "en")
        const docLang = document.documentElement.lang;
        if (docLang) {
            const lower = docLang.toLowerCase();
            if (lower.startsWith('zh')) return 'zh';
        }
    } catch (_) { /* DOM unavailable */ }

    return 'en';
}

const L = getLanguage();

/* ------------------------------------------------------------------ */
/*  Bilingual UI strings                                               */
/* ------------------------------------------------------------------ */
const T = {
    displayName: { zh: '数学计算器', en: 'Math Calculator' },

    description: {
        zh: [
            '计算一个或多个数学表达式。支持链式引用之前的结果([N].result)，支持高等数学运算。',
            '基础: + - * / % ^ ** 、三角函数(sin/cos/tan/asin/acos/atan)、对数(log/log10/log2)、指数(exp)、',
            '平方根(sqrt/nthRoot)、取整(ceil/floor/round)、绝对值(abs)、最大值(max)/最小值(min)',
            '高等: 导数(derivative)、行列式(det)、逆矩阵(inv)、特征值(eigs)、矩阵转置(transpose)',
            '常量: pi(PI)、e、i(虚数)、Infinity(无穷)',
            '示例: ["2+3*4", "[1].result*2", "sqrt([2].result)"]',
        ].join(' '),
        en: [
            'Evaluate one or more mathematical expressions. Supports chaining to previous results ([N].result) and higher math.',
            'Basic: + - * / % ^ **, trig (sin/cos/tan/asin/acos/atan), log (log/log10/log2), exp,',
            'sqrt/nthRoot, rounding (ceil/floor/round), abs, max/min,',
            'Higher: derivative, det (determinant), inv (inverse matrix), eigs (eigenvalues), transpose,',
            'Constants: pi (PI), e, i (imaginary unit), Infinity,',
            'Example: ["2+3*4", "[1].result*2", "sqrt([2].result)"]',
        ].join(' '),
    },

    expressions: {
        zh: [
            '需要计算的数学表达式数组，按顺序执行。',
            '可使用 [N].result 引用第 N 条表达式的计算结果(N 从 1 开始)。',
            '支持赋值: x = 5 (后续表达式可用 x)。',
            '高等运算: derivative("x^2", "x") 求导, det([[1,2],[3,4]]) 行列式, inv([[1,2],[3,4]]) 逆矩阵。',
        ].join(' '),
        en: [
            'Array of mathematical expressions to evaluate, in order.',
            'Use [N].result to reference the result of the Nth expression (1-based).',
            'Supports assignment: x = 5 (x is available in subsequent expressions).',
            'Higher math: derivative("x^2", "x"), det([[1,2],[3,4]]), inv([[1,2],[3,4]]).',
        ].join(' '),
    },

    item: { zh: '一条数学表达式字符串', en: 'A mathematical expression string' },

    precision: { zh: '结果有效位数，默认 15，范围 1-30', en: 'Significant digits, default 15, range 1-30' },

    formatMessage: (count, preview) => {
        const more = count > 3 ? '...' : '';
        if (L === 'zh') {
            return `正在计算 ${count} 个表达式: ${preview}${more}`;
        }
        return `Calculating ${count} expression(s): ${preview}${more}`;
    },
};

/* ------------------------------------------------------------------ */
/*  Register the calculate function tool                               */
/* ------------------------------------------------------------------ */
registerFunctionTool({
    name: 'calculate',
    displayName: T.displayName[L] || T.displayName.en,
    description: T.description[L] || T.description.en,

    parameters: {
        $schema: 'http://json-schema.org/draft-04/schema#',
        type: 'object',
        properties: {
            expressions: {
                type: 'array',
                description: T.expressions[L] || T.expressions.en,
                items: {
                    type: 'string',
                    description: T.item[L] || T.item.en,
                },
            },
            precision: {
                type: 'integer',
                description: T.precision[L] || T.precision.en,
                minimum: 1,
                maximum: 30,
            },
        },
        required: ['expressions'],
    },

    action: async ({ expressions, precision }) => {
        if (!Array.isArray(expressions) || expressions.length === 0) {
            throw new Error('expressions must be a non-empty array');
        }

        const exprList = expressions.map((e) => String(e).trim());
        const p = precision
            ? Math.min(Math.max(parseInt(precision, 10) || 15, 1), 30)
            : 15;
        const results = evaluate(exprList, p);

        return JSON.stringify(
            results.map((r) => ({
                index: r.index,
                expression: r.expression,
                result: r.display,
            })),
        );
    },

    formatMessage: ({ expressions }) => {
        const count = Array.isArray(expressions) ? expressions.length : 0;
        const preview = Array.isArray(expressions)
            ? expressions.slice(0, 3).join(', ')
            : '';
        return T.formatMessage(count, preview);
    },
});
