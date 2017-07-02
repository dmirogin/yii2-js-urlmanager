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
        if (params.suffix !== undefined) {
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

        let resultRule = '/' + trimmedSlashesName;
        let validRule = true;

        let replacedGroups = 0;
        do {
            matches = regexpGroups.exec(this.name);
            if (matches) {
                let [group, groupKey, groupRegexpString] = matches;

                let groupRegexp = new RegExp(groupRegexpString);
                if (!groupRegexp.test(<string>urlParams[groupKey])) {
                    validRule = false;
                    break;
                }

                resultRule = resultRule.replace(new RegExp(helper.escapeRegexp(group)), <string>urlParams[groupKey]);
                replacedGroups++;
            }
        } while (matches);

        if (trimmedSlashesName) {
            resultRule += this.suffix;
        }

        if (!replacedGroups && !helper.isEmptyObject(urlParams)) {
            resultRule += '?' + helper.buildQueryString(urlParams);
        }

        if (!validRule) {
            return '/' + this.route + this.suffix + '?' + helper.buildQueryString(urlParams);
        }

        return resultRule;
    }
}