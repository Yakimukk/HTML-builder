const fs = require('fs')
const path = require('path')

const folder = path.join(__dirname, 'secret-folder')

fs.readdir(folder, {withFileTypes: true}, (err, files) => {
    for (const file of files) {
        if (file.isFile()) {
            const folderFile = path.join(folder, file.name)
            const extension = path.extname(folderFile)
            const name = file.name.split('.')[0]
            fs.stat(folderFile, (err, stats) => {
                const size = `${(stats.size/1024).toFixed(3)}kb`
                console.log(`${name} - ${extension} - ${size}`)
            })
        }
    }
})
