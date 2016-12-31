# basealphabet
represent a number with any base using any alphabet (JS)

Use it like this:

```
var BaseAlphabet = require('basealphabet').BaseAlphabet;

var alpha32 = new BaseAlphabet({
	alphabet: '0123456789ABCDEFGHJKMNPQRTUVWXY$',   // provide an alphabet for your number system
	radix: 32,                                      // a base, there are 32 chars in my alphabet
	caseInsensitive: true,                          // yes, 'A' is the same as 'a'
	alias: { '醁' : 'Y' }                           // this 醁 is the same as 'Y'
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

console.log("Random base32 num with eight digits:",alpha32.randomNumber(8));

```

Enjoy.
