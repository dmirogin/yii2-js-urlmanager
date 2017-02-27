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

                let groupRegexp = new RegExp(StringHelper.escapeRegexp(group));

                if (!groupRegexp.test(<string>urlParams[groupName])) {
                    validParam = false;
                }

                validUrl = validUrl.replace(new RegExp(StringHelper.escapeRegexp(matches[0])), <string>urlParams[groupName]);
            }
        } while (matches);

        return validUrl;
    }
}