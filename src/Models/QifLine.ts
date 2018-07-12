import { QifDetail } from "./QifDetail";

export class QifLine {
    public details: QifDetail[] = [];

    public toString = (): string => {
        let result = "";
        this.details.forEach((detail) => {
            result += detail + "\n";
        });

        return result;
    }
}
