import fs = require("fs");
import { read, WorkBook } from "xlsx";
import { QifFile, QifFileType } from "../Models/QifFile";
import { IParser } from "../Parsers/IParser";

export class XlsQifParseManager {
    public parser: IParser<WorkBook, QifFile>;
    constructor(parser: IParser<WorkBook, QifFile>) {
        this.parser = parser;
    }

    public convert(srcPath: string, destPath: string, fileType: QifFileType) {
        const file = this.import(srcPath, fileType);

        this.writeFile(file, destPath);
    }

    public convertFile(file: QifFile, destPath: string) {
        this.writeFile(file, destPath);
    }

    public convertFiles(files: QifFile[], destPath: string) {
        this.writeFile(this.joinFiles(files, files[0].type), destPath);
    }
    
    public import(srcPath: string, fileType: QifFileType): QifFile {
        const wb = read(srcPath, { type: "file", cellDates: true });
        
        const file = this.parser.parse(wb);
        file.type = fileType;
        
        return file;
    }
    
        private joinFiles(files: QifFile[], fileType: QifFileType): QifFile {
            const newFile = new QifFile();
            newFile.type = fileType;
    
            return files.reduce((p, c) => {
                c.lines.forEach((line) => p.lines.push(line));
    
                return p;
            }, newFile);
        }
    
        private writeFile(file: QifFile, destPath: string) {
            fs.writeFile(destPath, file.toString(), (err) => { if (err) { throw err.message; } });
        }
}
