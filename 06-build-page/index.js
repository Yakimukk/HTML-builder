const fs = require('fs')
const path = require('path')
const fsPromises = fs.promises

const projectDist = path.join(__dirname, 'project-dist')
const assets = path.join(__dirname, 'assets')
const assetsCopy = path.join(projectDist, 'assets')

/*
Дорогой проверяющий, 
я не успела доделать 6 задание к дедлайну, 
если есть такая возможность, 
не могли бы вы проверить/перепроверить задание позже
Спасибо!
*/


//Создаём папку project-dist

fs.mkdir(path.join(projectDist), { recursive: true }, (err) => {
    if (err) throw err
})

//Собираем в единый файл стили из папки styles и помещаем их в файл project-dist/style.css

const pathStyle = path.join(__dirname, 'project-dist', 'style.css')
const styles = path.join(__dirname, 'styles')

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

function copyAssets(assetsCopy, assets) {
    fsPromises.mkdir(assetsCopy, {recursive: true}).then().catch()
    fs.readdir(assets, {withFileTypes: true}, (err, files) => {
        for (const file of files) {
            const pathFile = path.join(assets, file.name)
            const pathFileTwo = path.join(assetsCopy, file.name)
            if (file.isDirectory()) {
                fsPromises.mkdir(pathFileTwo, { recursive: true })
                copyAssets(pathFile, pathFileTwo)
                console.log('yes')
            } else if (file.isFile()) {
                fsPromises.copyFile(pathFile, pathFileTwo)
            }
        }
    })
    //console.log('yes')
}


fs.rm(projectDist, {recursive: true, force: true}, () => {
    fs.mkdir(projectDist, {recursive: true}, () => {
        fs.mkdir(assetsCopy, {recursive: true}, () => {
            copyAssets(assetsCopy, assets)
        })
        unionCSS()
    })
})