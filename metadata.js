import fs from 'fs';

const metadataFolder = "./metadata";

function saveMetaData(id, obj) {
    fs.writeFileSync(metadataFolder + "/" + id + ".json",
                     JSON.stringify(obj));
}

function readMetaData(id) {
    let p = metadataFolder + "/" + id + ".json";
    if (fs.existsSync(p)) {
        return JSON.parse(fs.readFileSync(p));
    }
    return {};
}

export { saveMetaData, readMetaData }