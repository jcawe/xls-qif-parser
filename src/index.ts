import { IXlsQifSchema } from "./Parsers/IXlsQifSchema";
import { QifDetailType } from "./Models/QifDetail";
import { QifFileType } from "./Models/QifFile";
import { SheetQifParser } from "./Parsers/SheetQifParser";
import { XlsQifParseManager } from "./Managers/XlsQifParseManager";
import { XlsQifParser } from "./Parsers/XlsQifParser";

export function convertExcelToQif(src: string, dest: string) {
    const schema: IXlsQifSchema = {};
    schema[0] = QifDetailType.D;
    schema[1] = QifDetailType.P;
    schema[2] = QifDetailType.T;
    const sParser = new SheetQifParser(schema);
    const parser = new XlsQifParser(sParser);
    const manager = new XlsQifParseManager(parser);

    manager.convert(src, dest, QifFileType.Bank);
}
