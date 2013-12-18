
function extend(obj) {
    Array.prototype.slice.call(arguments, 1).forEach(function (source) {
        if (!source) { return; }

        Object.keys(source).forEach(function (name) {
            obj[name] = source[name];
        });
    });

    return obj;
}

function getGCD(a, b) {
    return b ? getGCD(b, a % b) : a;
}

function getReduced(numerator, denominator) {
    var gcd = getGCD(numerator, denominator);
    return [numerator / gcd, denominator / gcd];
}

exports.extend = extend;
exports.getGCD = getGCD;
exports.getReduced = getReduced;
