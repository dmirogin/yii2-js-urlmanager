export interface IUrlParams
{
    [index: string]: number | string;
}
export interface IRule
{
    name: string;
    route: string;
}
export interface IUrlManagerConfig {
    enablePrettyUrl?: boolean;
    rules: IRule[],
    suffix?: string
}