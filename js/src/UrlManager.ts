import UrlRule from './UrlRule';
import {IUrlParams, IUrlManagerConfig, IRule} from './interfaces';
import * as helper from './helpers';

/**
 * urlManager allow create URLs based php configuration urlManager component
 */
export default class UrlManager {
    /**
     * Allow to create human-friendly URLs
     */
    private enablePrettyUrl: boolean;
    /**
     * The rules for creating URLs
     */
    private rules: UrlRule[];

    constructor(config: IUrlManagerConfig) {
        this.enablePrettyUrl = config.enablePrettyUrl; // @TODO
        this.rules = this.buildRules(config.rules);
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
    public createUrl(route: string, urlParams: IUrlParams = {}) : string {
        let result: string = route;

        for (let rule of this.rules) {
            let compiledRule = rule.createUrl(route, urlParams);
            if (compiledRule !== false) {
                return <string>compiledRule;
            }
        }

        if (!helper.isEmptyObject(urlParams)) {
            result += '?' + helper.buildQueryString(urlParams);
        }

        return result;
    }
}