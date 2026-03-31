export interface Contexts {
    key: string;
    visible?: (element?: any, element1?: any) => boolean;
    value?: (element?: any) => any;
}
