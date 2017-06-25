import UrlRule from './UrlRule';

declare global {
    interface String {
        escapeRegexp(): string;
    }
    interface Object {
        buildQueryString() : string;
    }
    interface IUrlParams
    {
        [index: string]: number | string;
    }
}

String.prototype.escapeRegexp = function() : string {
    return this.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

Object.prototype.buildQueryString = function() : string {
    return Object.keys(this)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(this[key]))
        .join('&');
};

interface IRule
{
    name: string;
    route: string;
}

interface IUrlManagerConfig {
    enablePrettyUrl?: boolean;
    rules: IRule[]
}

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
        this.enablePrettyUrl = config.enablePrettyUrl;
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