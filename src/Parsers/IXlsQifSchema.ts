import { QifDetailType } from "../Models/QifDetail";

export interface IXlsQifSchema {
    [def: number]: QifDetailType;
}