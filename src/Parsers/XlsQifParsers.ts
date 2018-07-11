import { IParser } from "./IParser";
import { read, utils, WorkBook, WorkSheet, CellObject } from 'xlsx';
import { QifFile, QifLine, QifDetailType, QifDetail } from "../Models/QifModels";
import * as moment from "moment";

export interface XlsQifSchema {
    [def: number]: QifDetailType
}

export class XlsQifParser implements IParser<WorkBook, QifFile> {
    sheetParser: SheetQifParser;
    constructor(sheetParser: SheetQifParser) {
        this.sheetParser = sheetParser;
    }

    public parse(data: WorkBook): QifFile {
        let file = new QifFile();
        data.SheetNames.forEach(sheetName => {
            this.sheetParser.parse(data.Sheets[sheetName]).forEach(qifLine => {
                file.lines.push(qifLine);
            });
        });

        return file;
    }
}

export class SheetQifParser implements IParser<WorkSheet, QifLine[]> {
    schema: XlsQifSchema;

    constructor(schema: XlsQifSchema) {
        this.schema = schema;
    }

    public parse(data: WorkSheet): QifLine[] {
        let lines: QifLine[] = [];
        let ref = utils.decode_range(data['!ref']);

        for (let row = ref.s.r; row <= ref.e.r; row++) {
            let line = new QifLine();
            for (let col = ref.s.c; col <= ref.e.c; col++) {
                const cellAddress: string = utils.encode_cell({ c: col, r: row });
                const cell: CellObject = data[cellAddress];
                let detail = this.createDetail(cell, col);
                line.details.push(detail);
            }
            lines.push(line);
        }

        return lines;
    }

    createDetail(cell: CellObject, col: number): QifDetail {
        let detail = new QifDetail();
        detail.type = this.schema[col];

        if(this.schema[col] === QifDetailType.D){
            detail.value = moment(cell.v as Date).format("MM/DD/YYYY");
        }
        else detail.value = cell.v.toString();

        return detail;
    }
}