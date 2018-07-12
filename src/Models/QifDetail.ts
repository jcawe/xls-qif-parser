export enum QifDetailType { D = "D", T = "T", P = "P" }

export class QifDetail {
    public type: QifDetailType;
    public value: string;

    public toString = (): string => {
        return this.type + this.value;
    }
}
