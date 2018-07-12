import { WorkBook } from "xlsx";
import { QifFile } from "../Models/QifFile";
import { IParser } from "./IParser";
import { SheetQifParser } from "./SheetQifParser";

export class XlsQifParser implements IParser<WorkBook, QifFile> {
    public sheetParser: SheetQifParser;
    constructor(sheetParser: SheetQifParser) {
        this.sheetParser = sheetParser;
    }

    public parse(data: WorkBook): QifFile {
        const file = new QifFile();
        data.SheetNames.forEach((sheetName) => {
            this.sheetParser.parse(data.Sheets[sheetName]).forEach((qifLine) => {
                file.lines.push(qifLine);
            });
        });

        return file;
    }
}
