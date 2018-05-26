export enum QifFileType { Cash = "Cash", Bank = "Bank", CreditCard = "CreditCard" }
export enum QifDetailType { D = "D", T = "T", P = "P" }

export class QifDetail {
    public type: QifDetailType;
    public value: string;

    public toString = () : string => {
        return this.type + this.value;
    }
}

export class QifLine {
    public details: QifDetail[] = [];

    public toString = () : string => {
        let result = '';
        this.details.forEach(detail => {
            result += detail + '\n';
        });

        return result;
    }
}

export class QifFile {
    public type: QifFileType;
    public lines: QifLine[] = [];

    public toString = () : string => {
        let result = '!Type:' + this.type + '\n';

        this.lines.forEach(line => {
            result += line + '^' + '\n';
        });

        return result;
    }
}