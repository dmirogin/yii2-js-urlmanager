import {IUrlParams, IRule} from './interfaces';
import * as helper from './helpers';

/**
 * UrlRule is a rule for generating URLs
 */
export default class UrlRule {
    /**
     * The name of this url
     */
    private name: string;
    /**
     * The route to the controller action
     */
    private route: string;
    private suffix: string = '';

    constructor(params: IRule) {
        this.name = params.name;
        this.route = helper.stripSlashes(params.route);
        if (params.suffix) {
            this.suffix = params.suffix;
        }
    };

    /**
     * Create url
     * @param route The route
     * @param urlParams The parameters
     * @returns {boolean | string} URL or false if this rule can't  be created
     */
    createUrl(route, urlParams: IUrlParams = {}) : boolean | string {
        if (helper.stripSlashes(route) !== this.route) {
            return false;
        }

        let trimmedSlashesName = helper.trimSlashes(this.name);
        let regexpGroups = /<([\w._-]+):?([^>]+)?>/g;
        let matches;

        let hash: string;
        if (urlParams['#'] !== undefined) {
            hash = <string> urlParams['#'];
            delete urlParams['#'];
        }

        let remainingParams = {...urlParams};
        let resultRule = '/' + trimmedSlashesName;
        let validRule = true;

        let replacedGroups = 0;
        do {
            matches = regexpGroups.exec(this.name);
            if (matches) {
                let [group, groupKey, groupRegexpString] = matches;

                if (!this.validateGroup(groupRegexpString, <string> urlParams[groupKey])) {
                    // Suppose it is invalid url unless group passed test
                    validRule = false;
                    break;
                }

                resultRule = this.replaceGroup(resultRule, group, <string>urlParams[groupKey]);
                delete remainingParams[groupKey];
                replacedGroups++;
            }
        } while (matches);

        if (!validRule) {
            resultRule = '/' + this.route;
        }

        if (trimmedSlashesName) {
            // Add suffix if it isn't a slash
            resultRule += this.suffix;
        }

        if (!helper.isEmptyObject(urlParams) && (!replacedGroups || !validRule)) {
            resultRule += '?' + helper.buildQueryString(urlParams);
        } else if (!helper.isEmptyObject(remainingParams) && replacedGroups) {
            resultRule += '?' + helper.buildQueryString(remainingParams);
        }

        if (hash) {
            resultRule += '#' + hash;
        }

        return resultRule;
    }

    /**
     * Validate regex group by value that passed in params
     * @param groupRegexpString
     * @param groupValue
     * @returns {boolean}
     */
    private validateGroup(groupRegexpString: string, groupValue: string) : boolean {
        let groupRegexp = new RegExp(groupRegexpString);
        return groupRegexp.test(groupValue);
    }

    /**
     * Replace group in result string by value that passed in params
     * @param string
     * @param group
     * @param value
     * @returns {string}
     */
    private replaceGroup(string: string, group: string, value: string) : string {
        return string.replace(new RegExp(helper.escapeRegexp(group)), value);
    }
}