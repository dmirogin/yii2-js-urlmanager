interface String {
    escapeRegexp() : string;
}

String.prototype.escapeRegexp = function() : string {
    return this.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

interface Object {
    buildQueryString() : string;
}

Object.prototype.buildQueryString = function() : string {
    return Object.keys(this)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(this[key]))
        .join('&');
};

interface IUrlParams
{
    [index: string]: number | string;
}

/**
 * UrlRule is a rule for generating URLs
 */
class UrlRule {
    /**
     * The name of this url
     */
    private name: string;
    /**
     * The route to the controller action
     */
    private route: string;

    constructor(name: string, route: string) {
        this.name = name;
        this.route = route;
    };

    /**
     * Create url
     * @param route The route
     * @param urlParams The parameters
     * @returns {boolean | string} URL or false if this rule can't  be created
     */
    createUrl(route, urlParams: IUrlParams = {}) : boolean | string {
        if (route !== this.route) {
            return false;
        }

        let regexpGroups = /<([\w._-]+):?([^>]+)?>/g;
        let matches;

        let resultRule = this.name;
        let validRule = true;

        do {
            matches = regexpGroups.exec(this.name);
            if (matches) {
                let [group, groupKey, groupRegexpString] = matches;

                let groupRegexp = new RegExp(groupRegexpString);
                if (!groupRegexp.test(<string>urlParams[groupKey])) {
                    validRule = false;
                    break;
                }

                resultRule = resultRule.replace(new RegExp(group.escapeRegexp()), <string>urlParams[groupKey]);
            }
        } while (matches);

        if (!validRule) {
            return this.route + '?' + urlParams.buildQueryString();
        }

        return resultRule;
    }
}

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
class UrlManager {
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
        console.log(config);
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