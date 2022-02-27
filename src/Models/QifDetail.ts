export enum QifDetailType { D = "D", T = "T", P = "P" }

export class QifDetail {
    public type: QifDetailType;
    public value: string;

    public constructor(detail?: QifDetail) {
        this.type = detail ? detail.type : null;
        this.value = detail ? detail.value : null;
    }
    public toString = (): string => {
        return this.type + this.value;
    }
}
