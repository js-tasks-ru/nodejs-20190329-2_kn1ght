function sum(a, b) {
    if (!isNumber(a) || !isNumber(b)) {
    	throw new TypeError("Some of arguments is not a number");
    } else {
        return a + b;
    }
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

module.exports = sum;
