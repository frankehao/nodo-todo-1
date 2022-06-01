const { program } = require('commander')
program.option('-x, --xxx', 'what the x')
program.parse(process.argv)
console.log(program.xxx)
