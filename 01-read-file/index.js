const path = require('path')
const fs = require('fs')


const text = path.join(__dirname, 'text.txt')
const stream = fs.createReadStream(text, 'utf-8')
let data = ''

stream.on('data', chunk => data += chunk)
stream.on('end', () => console.log(data))