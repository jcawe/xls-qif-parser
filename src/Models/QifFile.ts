import { QifLine } from "./QifLine";

export enum QifFileType { Cash = "Cash", Bank = "Bank", CreditCard = "CreditCard" }

export class QifFile {
    public type: QifFileType;
    public lines: QifLine[] = [];

    public constructor(file?: any) {
        file = file || {};

        this.type = file.type || null;

        if (file.lines) {
            file.lines.forEach((line) => {
                const newLine = new QifLine(line);
                this.lines.push(newLine);
            });
        }
    }

    public toString = (): string => {
        let result = "!Type:" + this.type + "\n";

        this.lines.forEach((line) => {
            result += line.toString() + "^" + "\n";
        });

        return result;
    }
}
