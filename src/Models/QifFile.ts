import { QifLine } from "./QifLine";

export enum QifFileType { Cash = "Cash", Bank = "Bank", CreditCard = "CreditCard" }

export class QifFile {
    public type: QifFileType;
    public lines: QifLine[] = [];

    public toString = (): string => {
        let result = "!Type:" + this.type + "\n";

        this.lines.forEach((line) => {
            result += line + "^" + "\n";
        });

        return result;
    }
}