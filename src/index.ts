import { XlsQifParseManager } from "./Managers/XlsQifParseManager";
import { QifDetailType } from "./Models/QifDetail";
import { QifFileType } from "./Models/QifFile";
import { XlsQifParser } from "./Parsers/XlsQifParser";
import { IXlsQifSchema } from "./Parsers/IXlsQifSchema";
import { SheetQifParser } from "./Parsers/SheetQifParser";

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
