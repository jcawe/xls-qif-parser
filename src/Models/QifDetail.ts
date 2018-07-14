export enum QifDetailType { D = "D", T = "T", P = "P" }

export class QifDetail {
    public type: QifDetailType;
    public value: string;

    public constructor(detail?: any) {
        detail = detail || {};

        this.type = detail.type || null;
        this.value = detail.value || null;
    }
    public toString = (): string => {
        return this.type + this.value;
    }
}
