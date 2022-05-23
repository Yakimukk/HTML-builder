const fs = require('fs')
const path = require('path')
const fsPromises = fs.promises

const pathBundle = path.join(__dirname, 'project-dist', 'bundle.css')
const styles = path.join(__dirname, 'styles')

fs.readdir(styles, {withFileTypes: true}, (err, files) => {
    fs.createWriteStream(pathBundle)
    files.forEach((file) => {
        const styleFiles = path.join(styles, file.name)
        if (file.isFile() && path.extname(styleFiles) === '.css') {
            const input = fs.createReadStream(styleFiles, 'utf-8')
            let css = ''
            input.on('data', chunk => css += chunk)
            input.on('end', () => {
                css = `${css}`
                fs.appendFile(pathBundle, css, (err) => {
                        if (err) throw err
                    }
                )
            })
        }
    })
})