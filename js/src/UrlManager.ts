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
    /**
     * Suffix for url
     * @type {string}
     */
    private suffix: string = '';
    /**
     * Prefix for url, depends on enablePrettyUrl and showScriptName settings
     * Can contain something looks like '/index.php'
     * Or baseUrl, if application document root is in subdirectories
     * @type {string}
     */
    private prefix: string = '';

    public configure(config: IUrlManagerConfig) {
        if (config.enablePrettyUrl !== undefined) {
            this.enablePrettyUrl = config.enablePrettyUrl;
        }
        if (config.showScriptName !== undefined) {
            this.showScriptName = config.showScriptName;
        }
        if (config.suffix !== undefined) {
            this.suffix = config.suffix;
        }
        if (config.prefix !== undefined) {
            this.prefix = config.prefix;
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
            if (!rule.suffix) {
                rule.suffix = this.suffix;
            }
            result.push(new UrlRule(rule));
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
        let result: string;

        if (this.enablePrettyUrl) {
            let prettyResultUrl = this.createPrettyUrl(route, urlParams);
            if (prettyResultUrl) {
                result = prettyResultUrl;
            } else if (!prettyResultUrl) {
                result =  '/' + helper.stripSlashes(route) + this.suffix;
                if (!helper.isEmptyObject(urlParams)) {
                    result += '?' + helper.buildQueryString(urlParams);
                }
            }
        } else {
            result = UrlManager.createQueryUrl(route, urlParams);
        }

        if (this.prefix) {
            result = this.prefix + result;
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