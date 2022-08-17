
const docx = require("docx");
const { Document, Packer, Paragraph, Media,ImageRun } = docx;
const fs = require('fs');

// 保存到word
async function saveDocx(imgePaths, wordPath) {
    try {
        // const doc = new Document();

        const height = 465;
        const width = 600;

        let list = []
        for (let i = 0; i < imgePaths.length; i++) {
            const infile = imgePaths[i];

            list.push(new Paragraph({
                children: [
                    new ImageRun({
                        data: fs.readFileSync(infile),
                        transformation: {
                            width: width,
                            height: height,
                        }
                    }),
                ],
            }))
        }

        const doc = new Document({ sections: [{ children: list }] });

        const b64string = await Packer.toBase64String(doc);
        const bs = Buffer.from(b64string, 'base64')

        var ws = fs.createWriteStream(wordPath)
        ws.write(bs)
        ws.end()
    } catch (error) {
        console.log(error)
    }
}



saveDocx(['./output/screenshot202208090039.png'], './AA.docx')