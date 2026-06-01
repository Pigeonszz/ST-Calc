import { create, all } from 'mathjs';

const math = create(all, {
    number: 'BigNumber',
    precision: 30,
});

function formatResult(value, precision) {
    const fmt = math.format(value, { notation: 'auto', precision });
    return fmt;
}

export function evaluate(expressions, precision = 15) {
    const results = [];
    const scope = {};

    for (let i = 0; i < expressions.length; i++) {
        let expr = expressions[i];

        expr = expr.replace(/\[(\d+)\]\.result/g, (_, idx) => {
            const n = parseInt(idx, 10);
            const ref = results[n - 1];
            if (!ref) throw new Error(`Referenced non-existent result [${n}]`);
            return `(${ref.result.toString()})`;
        });

        const raw = math.evaluate(expr, scope);
        const display = formatResult(raw, precision);

        results.push({
            index: i + 1,
            expression: expressions[i],
            result: raw,
            display: display,
        });

        const label = expressions[i].match(/^([a-zA-Z_]\w*)\s*=\s*(.+)/);
        if (label) {
            scope[label[1]] = raw;
        }
    }

    return results;
}

export { math };
