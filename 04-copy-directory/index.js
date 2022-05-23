const fs = require('fs')
const path = require('path')
const fsPromises = fs.promises

const folderFiles = path.join(__dirname, 'files')
const folderCopy = path.join(__dirname, 'files-copy')

fs.promises.rm(folderCopy, {recursive: true, force: true}).finally(() => {
    filesCopy()
})

function filesCopy() {
    fsPromises.mkdir(folderCopy, {recursive: true}).then().catch()
    fs.readdir(folderFiles, {withFileTypes: true}, function (err, files) {
        for (const file of files) {
            if (file.isFile()) {
                const pathFile = path.join(folderFiles, file.name)
                const pathFileTwo = path.join(folderCopy, file.name)
                fsPromises.copyFile(pathFile, pathFileTwo).then().catch()
            }
        }
    })
}

