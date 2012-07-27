var Things = new Array();
var fs = require('fs');


for (var i = 1000 - 1; i >= 0; i--) {
	Things[i] = new Array();
	Things[i][0] = i;
	Things[i][1] = Math.random();
};

console.log(Things);

fs.writeFileSync('d1.json', 'var d1 = '+JSON.stringify(Things)+';', 'utf8');