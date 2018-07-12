import { XlsQifParseManager } from "./Managers/XlsQifParseManager";
import { QifDetailType } from "./Models/QifDetail";
import { QifFileType } from "./Models/QifFile";
import { SheetQifParser, XlsQifParser, XlsQifSchema } from "./Parsers/XlsQifParsers";

export function convertExcelToQif(src: string, dest: string) {
    const schema: XlsQifSchema = {};
    schema[0] = QifDetailType.D;
    schema[1] = QifDetailType.P;
    schema[2] = QifDetailType.T;
    const sParser = new SheetQifParser(schema);
    const parser = new XlsQifParser(sParser);
    const manager = new XlsQifParseManager(parser);

    manager.convert(src, dest, QifFileType.Bank);
}
