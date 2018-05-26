export interface IParser<T,R>{
    parse(data: T): R;
}