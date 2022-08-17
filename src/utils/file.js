const fs = require('fs');

function DeleteFile(path) {
    fs.unlink(path, function (error) {
        if (error) {
            console.log(error);
            return false;
        }
    })
}

function ReadFile(path) {
    return fs.readFileSync(path)
}

function SaveFile(path, stream) {
    try {
        var ws = fs.createWriteStream(path)
        ws.write(stream)
        ws.end()
        console.log(`文件 ${path} 保存成功。`);
    } catch (error) {
        console.error(error);
    }
}


module.exports = {
    SaveFile,
    ReadFile,
    DeleteFile
} 