import {UrlRule, IUrlParams} from "./UrlRule";

interface IRule
{
    name: string;
    route: string;
}

/**
 * urlManager allow create URLs based php configuration urlManager component
 */
export class UrlManager {
    /**
     * The rules for creating URLs
     */
    private rules: UrlRule[];

    constructor(rules: IRule[]) {
        this.rules = this.buildRules(rules);
    };

    /**
     * Create urlRule objects
     * @param rules The rules declaration
     * @returns {UrlRule[]}
     */
    protected buildRules(rules: IRule[]) : UrlRule[] {
        let result: UrlRule[] = [];

        for (let rule of rules) {
            result.push(new UrlRule(rule.name, rule.route));
        }

        return result;
    };

    /**
     * Creates a URL using the given route and query parameters.
     * @param route The route
     * @param urlParams The query parameters
     * @returns {string}
     */
    public createUrl(route: string, urlParams: IUrlParams) : string {
        let result: string = route;

        for (let rule of this.rules) {
            let compiledRule = rule.createUrl(route, urlParams);
            if (compiledRule !== false) {
                return <string>compiledRule;
            }
        }

        return result;
    }
}