var sum = 0;

for (var i = 0; i<process.argv.length; i++) {
if(!process.argv[i].isInteger())
	i++;
else
	sum += process.argv[i];
}

console.log('sum');