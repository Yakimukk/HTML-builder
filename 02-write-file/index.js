const fs = require('fs')
const path = require('path')
const readline = require('readline')
const stream = fs.createWriteStream(path.join(__dirname, 'text.txt'))
const read = readline.createInterface(process.stdin, process.stdout)

read.write('Пожалуйста, введите текст\n')
read.on('line', (text) => {
    if (text === 'exit') {
        read.write('Удачи!')
        process.exit()
    }
    stream.write(`${text}\n`)
})

read.on('close', () => {
    read.write('Удачи!')
    process.exit()
})