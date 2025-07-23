import DataUriParser from "datauri/parser.js"
import path from "path"

const getDataUri = (file) => {
    const parser = new DataUriParser();
    const extName = path.extname(file.originalname).toString();
    const result = parser.format(extName, file.buffer);
    console.log('DataURI result:', {
        originalname: file.originalname,
        extName,
        contentLength: result.content.length
    });
    return result;
}

export default getDataUri;