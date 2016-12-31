var BaseAlphabet = require('./index.js').BaseAlphabet;

var tests = 0;
var failed = 0;
var assert = function(blah) {
	if(!blah) {
		failed++;
		throw new "Test failed here"
	} else {
		tests++;
	}
}

var alpha32 = new BaseAlphabet({
	alphabet: '0123456789ABCDEFGHJKMNPQRTUVWXY$',
	radix: 32,
	caseInsensitive: true,
	alias: { '醁' : 'Y' }
});

console.log("AZQ=",alpha32.toDecimal("A$Q"));

assert(alpha32.toDecimal("$") == 31);
assert(alpha32.toDecimal("0") == 0);
assert(alpha32.toDecimal("10") == 32);
assert(alpha32.toDecimal("1$") == 32+31);

assert(alpha32.toAlphabet(31) == '$');
try {
	assert(alpha32.toAlphabet(31) == 'A');
} catch(e) {
	assert(true);
}
assert(alpha32.toAlphabet(32+31) == '1$');

assert(alpha32.toDecimal("醁") == 30);
assert(alpha32.toDecimal("11") == (32+1));
assert(alpha32.toDecimal("醁1") == ((32*30)+1));

console.log('tests',tests);
console.log('should have failed',failed);
assert(tests == 10)
assert(failed == 1)
console.log("if no visisble exceptions throw we are good.")

var alphaStrange = new BaseAlphabet({
	alphabet: 'QLJK',
	radix: 4
});


assert(alphaStrange.toDecimal("Q") == 0);
assert(alphaStrange.toAlphabet(4) == 'LQ');

