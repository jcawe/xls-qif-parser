import fs = require("fs");
import { read, utils, WorkBook } from "xlsx";
import { QifFile, QifFileType } from "../Models/QifModels";
import { IParser } from "../Parsers/IParser";

export class XlsQifParseManager {
    public parser: IParser<WorkBook, QifFile>;
    constructor(parser: IParser<WorkBook, QifFile>) {
        this.parser = parser;
    }

    public convert(srcPath: string, destPath: string, fileType: QifFileType) {
        const wb = read(srcPath, {type: "file", cellDates: true});

        const file = this.parser.parse(wb);
        file.type = fileType;

        fs.writeFile(destPath, file.toString(), () => {});
    }
}
