import { QifDetailType, QifFileType } from './Models/QifModels';
import { XlsQifParser, SheetQifParser, XlsQifSchema } from './Parsers/XlsQifParsers';
import { XlsQifParseManager } from './Managers/XlsQifParseManager';

export function convertExcelToQif(src: string, dest: string) {
    let schema: XlsQifSchema = {};
    schema[0] = QifDetailType.D;
    schema[1] = QifDetailType.P;
    schema[2] = QifDetailType.T;
    let sParser = new SheetQifParser(schema);
    let parser = new XlsQifParser(sParser)
    let manager = new XlsQifParseManager(parser);

    manager.convert(src, dest, QifFileType.Bank);
}