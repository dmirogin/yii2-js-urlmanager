interface IRule
{
    name: string;
    route: string;
}

interface IUrlParams
{
    [index: string]: number | string;
}

let escapeRegexp = (pattern: string) => pattern.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

class UrlRule
{
    private name: string;
    private route: string;

    constructor(name: string, route: string) {
        this.name = name;
        this.route = route;
    };

    createUrl(route, urlParams: IUrlParams) : boolean | string {
        if (route !== this.route) {
            return false;
        }

        let regexpGroups = /<([\w._-]+):?([^>]+)?>/g;
        let matches;

        let validParam = true;
        let validUrl: string = this.name;

        do {
            matches = regexpGroups.exec(this.name);
            if (matches) {
                let group: string = matches[2];
                let groupName: string = matches[1];

                let groupRegexp = new RegExp(escapeRegexp(group));
                if (!groupRegexp.test(<string>urlParams[groupName])) {
                    validParam = false;
                }

                validUrl = validUrl.replace(new RegExp(escapeRegexp(matches[0])), <string>urlParams[groupName]);
            }
        } while (matches);

        return validUrl;
    }
}

export class UrlManager {
    private rules: UrlRule[];

    constructor(rules: IRule[]) {
        this.rules = this.buildRules(rules);
    };

    protected buildRules(rules: IRule[]) : UrlRule[] {
        let result: UrlRule[] = [];

        for (let rule of rules) {
            result.push(new UrlRule(rule.name, rule.route));
        }

        return result;
    };

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