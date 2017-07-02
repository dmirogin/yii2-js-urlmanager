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
    private enablePrettyUrl: boolean = false;
    /**
     * Add enttry script name in the URL
     * This property is used only if enablePrettyUrl is true
     * @type {boolean}
     */
    private showScriptName: boolean = true;
    /**
     * The rules for creating URLs
     */
    private rules: UrlRule[];

    public configure(config: IUrlManagerConfig) {
        if (config.enablePrettyUrl !== undefined) {
            this.enablePrettyUrl = config.enablePrettyUrl;
        }
        if (config.showScriptName !== undefined) {
            this.showScriptName = config.showScriptName;
        }
        this.buildRules(config.rules);
    }

    /**
     * Create urlRule objects
     * @param rules The rules declaration
     */
    private buildRules(rules: IRule[]) : void {
        let result: UrlRule[] = [];

        for (let rule of rules) {
            result.push(new UrlRule(rule.name, helper.stripSlashes(rule.route)));
        }

        this.rules = result;
    };

    /**
     * Creates a URL using the given route and query parameters.
     * @param route The route
     * @param urlParams The query parameters
     * @returns {string}
     */
    public createUrl(route: string, urlParams: IUrlParams = {}) : string {
        let result: string = route;

        if (this.enablePrettyUrl) {
            let prettyResultUrl = this.createPrettyUrl(route, urlParams);
            if (prettyResultUrl) {
                result = prettyResultUrl;
            } else if (!prettyResultUrl && !helper.isEmptyObject(urlParams)) {
                result += '?' + helper.buildQueryString(urlParams);
            }
        } else {
            result = UrlManager.createQueryUrl(route, urlParams);
        }

        if (this.showScriptName || !this.enablePrettyUrl) {
            result = '/index.php' + result;
        }

        return result;
    }

    /**
     * Create pretty url
     * @param route
     * @param urlParams
     * @returns {string|null}
     */
    private createPrettyUrl(route: string, urlParams: IUrlParams = {}) : string {
        for (let rule of this.rules) {
            let compiledRule = rule.createUrl(route, urlParams);
            if (compiledRule !== false) {
                return <string>compiledRule;
            }
        }

        return null;
    }

    /**
     * Create url that consisted of query params
     * @param route
     * @param urlParams
     * @returns {string}
     */
    private static createQueryUrl(route: string, urlParams: IUrlParams = {}) : string {
        return '?r=' + encodeURIComponent(helper.stripSlashes(route)) + '&' + helper.buildQueryString(urlParams);
    }
}