import { QifDetail } from "./QifDetail";

export class QifLine {
    public details: QifDetail[] = [];

    public constructor(line?: QifLine) {
        if (line && line.details) {
            line.details.forEach((detail) => {
                const newDetail = new QifDetail(detail);
                this.details.push(newDetail);
            });
        }
    }
    public toString = (): string => {
        let result = "";
        this.details.forEach((detail) => {
            result += detail + "\n";
        });

        return result;
    }
}
