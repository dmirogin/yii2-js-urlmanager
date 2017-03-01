import {StringHelper} from "./StringHelper";

export interface IUrlParams
{
    [index: string]: number | string;
}

/**
 * UrlRule is a rule for generating URLs
 */
export class UrlRule {
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

                resultRule = resultRule.replace(new RegExp(StringHelper.escapeRegexp(group)), <string>urlParams[groupKey]);
            }
        } while (matches);

        if (!validRule) {
            return this.route + '?' + StringHelper.buildQueryString(urlParams);
        }

        return resultRule;
    }
}