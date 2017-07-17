export interface IUrlParams
{
    [index: string]: number | string;
}
export interface IRule
{
    name: string;
    route: string;
    suffix?: string;
}
export interface IUrlManagerConfig {
    enablePrettyUrl?: boolean;
    showScriptName?: boolean;
    rules: IRule[],
    suffix?: string,
    prefix?: string,
}