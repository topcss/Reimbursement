const { Document, Packer, Paragraph, ImageRun } = require("docx")
const { SaveFile, ReadFile, DeleteFile } = require('./utils/file')

// 保存到word
async function SaveDocx(imgPaths, wordPath) {
    try {
        const height = 465;
        const width = 600;

        let list = []
        for (let i = 0; i < imgPaths.length; i++) {
            const infile = imgPaths[i];

            list.push(new Paragraph({
                children: [
                    new ImageRun({
                        data: ReadFile(infile),
                        transformation: {
                            width: width,
                            height: height,
                        }
                    }),
                ],
            }))

            // 用完即删
            DeleteFile(infile)
        }

        const doc = new Document({ sections: [{ children: list }] });
        const b64string = await Packer.toBase64String(doc);
        const bs = Buffer.from(b64string, 'base64')

        SaveFile(wordPath, bs)
    } catch (error) {
        console.log(error)
    }
}

module.exports = SaveDocx