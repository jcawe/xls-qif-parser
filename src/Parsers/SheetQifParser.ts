import * as moment from "moment";
import { CellObject, utils, WorkSheet } from "xlsx";
import { QifDetail, QifDetailType } from "../Models/QifDetail";
import { QifLine } from "../Models/QifLine";
import { IParser } from "./IParser";
import { IXlsQifSchema } from "./IXlsQifSchema";

export class SheetQifParser implements IParser<WorkSheet, QifLine[]> {
    public schema: IXlsQifSchema;

    constructor(schema: IXlsQifSchema) {
        this.schema = schema;
    }

    public parse(data: WorkSheet): QifLine[] {
        const lines: QifLine[] = [];
        const ref = utils.decode_range(data["!ref"]);

        for (let row = ref.s.r; row <= ref.e.r; row++) {
            const line = new QifLine();
            for (let col = ref.s.c; col <= ref.e.c; col++) {
                const cellAddress: string = utils.encode_cell({ c: col, r: row });
                const cell: CellObject = data[cellAddress];
                const detail = this.createDetail(cell, col);
                line.details.push(detail);
            }
            lines.push(line);
        }

        return lines;
    }

    public createDetail(cell: CellObject, col: number): QifDetail {
        const detail = new QifDetail();
        detail.type = this.schema[col];

        if (this.schema[col] === QifDetailType.D) {
            detail.value = moment(cell.v as Date).format("MM/DD/YYYY");
        } else { detail.value = cell.v.toString(); }

        return detail;
    }
}
