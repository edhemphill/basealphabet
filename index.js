

//var alphabet = '0123456789abcdefghjkmnpqrtuvwxyz'
var alphabet =   '0123456789ABCDEFGHJKMNPQRTUVWXYZ'
var alias = { O:0, I:1, L:1, S:5 };
var table = {};
var numTable = [];

//var makeStrRepeat = function(n,c) {
//	var s = "";
//	for(var p=0;p<n;p++) {
//		s += c;
//	}
//	return s;
//};

/// <summary>
/// Converts the given decimal number to the numeral system with the
/// specified radix (in the range [2, 36]).
/// </summary>
/// <param name="decimalNumber">The number to convert.</param>
/// <param name="radix">The radix of the destination numeral system (in the range [2, 36]).</param>
/// <returns></returns>
var DecimalToArbitrarySystem = function(decimalNumber, radix, table)
{
    var BitsInLong = 64;
//    var Digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var Digits = table;

    if (radix < 2 || radix > Digits.Length)
         throw new Error("The radix must be >= 2 and <= " + Digits.Length.ToString());

    if (decimalNumber == 0)
        return table[0];

    var index = BitsInLong - 1;
    var currentNumber = decimalNumber; //Math.Abs(decimalNumber);
//    char[] charArray = new char[BitsInLong];
//	var charArray = new Array(BitsInLong);
//	var charArray = makeStrRepeat(BitsInLong,'0');
	var outStr = "";

    while (currentNumber != 0)
    {
        var remainder = (currentNumber % radix);
        // console.log('remainder='+remainder);
        // console.log("digits="+Digits[remainder]);
        outStr = Digits[remainder] + outStr;
        currentNumber = Math.floor(currentNumber / radix);
    }

//    var result = new String(charArray, index + 1, BitsInLong - index - 1);
    if (decimalNumber < 0)
    {
        outStr = "-" + outStr;
    }

    return outStr;
}

var ArbitrarySystemToDecimal = function(arbNum, radix, dictionary) {
	var ret = 0;
	var str = new String(arbNum);

	for(var n=0;n<str.length;n++) {
		var c = str.charAt(str.length-n-1);
		var v = dictionary[c];
        if(v == undefined) {
            throw new RangeError("Not in alphabet: "+c);
        }
		if(v > 0)
			ret = ret + v*Math.pow(radix,n);
	}

	return ret;

}


for (var i = 0; i < alphabet.length; i++) {
	table[alphabet[i]] = i
}

var k = Object.keys(table);
for(var n=0;n<k.length;n++)
    numTable[n] = k[n];

// Splice in 'alias'
for (var key in alias) {
    if (!alias.hasOwnProperty(key)) continue;
    table[key] = table['' + alias[key]]
}

//console.dir(table);
//console.dir(numTable);
var toBase32 = function(number,digits) {

	var baseNumber = DecimalToArbitrarySystem(number,32,numTable);

    if(typeof digits == 'number') {
        while(baseNumber.length != digits) {
            baseNumber = '0' + baseNumber;
        }
    }

    return baseNumber;
};

var fromBase32 = function(base32num) {
	return ArbitrarySystemToDecimal(base32num.toUpperCase(),32,table);
};

/*var examples = [ 0, 31, 313, 11110000, 1091212012, 120120, 99999999, 33, 32, 32*32 ];

for(var n=0;n<examples.length;n++) {
	var v = toBase32(examples[n]);
	console.log('' + examples[n] + " = " + v +"[b32]" + " = " + fromBase32(v));
}*/






/**
 * make an alphabet converter
 * @param  {[type]} opts an object with these options:
 * {
 *    radix: 16,                   // the base for your number system
 *    table: "0123456789ABCDEF",   // a string representing your alphabet
 *    caseInsensitive: true        // if true, letters will be non case-sensitive (default)
 * }
 * @return {[type]}      [description]
 */
var baseAlphabet = function(opts) {
    if(opts &&
        (opts.radix && typeof opts.radix != 'number') ||
        (opts.alphabet && typeof opts.alphabet != 'string') || 
        (opts.alphabet && opts.radix && opts.alphabet.length != opts.radix)) {
        throw new TypeError("Invalid options - can't instantiate baseAlphabet")
    }

    if(opts && opts.alphabet) this.alphabet = opts.alphabet
    if(opts && opts.radix) this.radix = opts.radix

    this.table = {}
    for (var i = 0; i < this.alphabet.length; i++) {
        this.table[this.alphabet[i]] = i
    }    

    this.numTable = []
    var k = Object.keys(this.table);
    for(var n=0;n<k.length;n++)
        this.numTable[n] = k[n];

    if(opts && typeof opts.alias == 'object') {
        // Splice in 'alias'
        for (var key in opts.alias) {
            if (!opts.alias.hasOwnProperty(key)) continue;
            this.table[key] = this.table['' + opts.alias[key]]
        }        
    }
}

baseAlphabet.prototype.alphabet = '0123456789ABCDEF'
baseAlphabet.prototype.radix = 16
baseAlphabet.prototype.caseInsensitive = true

baseAlphabet.prototype.toDecimal = function(num) {
    if(typeof num == 'string') {
        if(this.caseInsensitive) {
            num = num.toUpperCase()
        }
//        console.dir(this)
        return ArbitrarySystemToDecimal(num,this.radix,this.table);
    } else {
        throw new TypeError("Bad param - not a string");
    }
}

baseAlphabet.prototype.toAlphabet = function(decnum) {
    if(typeof decnum == 'number') {
        return DecimalToArbitrarySystem(decnum,this.radix,this.numTable);
    } else {
        return new TypeError("Bad param - not a number");
    }
}

baseAlphabet.prototype.randomNumber = function(digits) {
    var max = Math.pow(this.radix,digits);
    var num = Math.random() * max;
    return this.toAlphabet(Math.round(num));
}

module.exports = {
    toBase32: toBase32,
    fromBase32: fromBase32,
    BaseAlphabet: baseAlphabet
};
