import { IParser } from "../Parsers/IParser"
import { read, utils, WorkBook } from 'xlsx';
import { QifFile, QifFileType } from "../Models/QifModels";
import fs = require('fs');

export class XlsQifParseManager {
    parser: IParser<WorkBook, QifFile>;
    constructor(parser: IParser<WorkBook, QifFile>) {
        this.parser = parser;
    }

    public convert(srcPath:string, destPath:string, fileType: QifFileType){
        let wb = read(srcPath, {type:"file", cellDates:true});

        let file = this.parser.parse(wb);
        file.type = fileType;

        fs.writeFile(destPath, file.toString(), function() {});
    }
}