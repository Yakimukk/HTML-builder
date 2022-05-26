const fs = require('fs')
const path = require('path')
const fsPromises = fs.promises

const projectDist = path.join(__dirname, 'project-dist')
const assets = path.join(__dirname, 'assets')
const assetsCopy = path.join(projectDist, 'assets')
const components = path.join(__dirname, 'components')
const pathToTemplate = path.join(__dirname, 'template.html')
const pathStyle = path.join(__dirname, 'project-dist', 'style.css')
const styles = path.join(__dirname, 'styles')



//Собираем в единый файл стили из папки styles и помещаем их в файл project-dist/style.css


function unionCSS() {
    fs.readdir(styles, {withFileTypes: true}, (err, files) => {
        fs.createWriteStream(pathStyle)
        files.forEach((file) => {
            const styleFiles = path.join(styles, file.name)
            if (file.isFile() && path.extname(styleFiles) === '.css') {
                const input = fs.createReadStream(styleFiles, 'utf-8')
                let css = ''
                input.on('data', chunk => css += chunk)
                input.on('end', () => {
                    css = `${css}\n`
                    fs.appendFile(pathStyle, css, (err) => {
                            if (err) throw err
                        }
                    )
                })
            }
        })
    })
}

//Копируем папку assets в project-dist/assets

function copyAssets(assetsFolder, assetsFolderInit) {
    fsPromises.mkdir(assetsFolder, {recursive: true}).then().catch()
    fs.readdir(assetsFolderInit, {withFileTypes: true}, (err, list) => {
        if (err) throw err
        for (let file of list) {
            const pathFile = path.join(assetsFolderInit, file.name)
            const pathFileTwo = path.join(assetsFolder, file.name)
            if (file.isFile()) {
                fsPromises.copyFile(pathFile, pathFileTwo).then().catch()
                continue
            }
            if (file.isDirectory()) {
                copyAssets(path.join(assetsFolder, file.name), path.join(assetsFolderInit, file.name))
                continue
            } 
        }
    })
    //console.log('yes')
}

let data = ''

const stream = fs.createReadStream(pathToTemplate, 'utf8')
stream.on('data', chunk => data += chunk)

fs.rm(projectDist, {recursive: true, force: true}, () => {
    fs.mkdir(projectDist, {recursive: true}, () => {
      fs.mkdir(assetsCopy, {recursive: true}, () => {
        copyAssets(assetsCopy, assets)
      })
      unionCSS()
    })
})

stream.on('end', () => {
    let template = data
    fs.readdir(components, (err, list) => {
        if (err) throw err
        list.forEach(item => {
            let newPath = path.join(components, item)
            const ext = path.extname(newPath)
            if (ext === '.html') {
                fs.readFile(newPath, (err, data) => {
                    if (err) throw err
                    const re = new RegExp(`{{${item.slice(0, -5)}}}`)
                    template = template.replace(re, data.toString())
                    fs.writeFile(path.join(projectDist, 'index.html'), template, (err) => {
                        if (err) throw err
                    })
                })
            }
        })
    })
})
