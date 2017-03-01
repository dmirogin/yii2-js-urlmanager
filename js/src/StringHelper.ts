/**
 * Useful functions working with strings
 */
export class StringHelper {
    /**
     * Escape string for use in RegExp
     * @param pattern The pattern
     * @returns {string} escaped string
     */
    public static escapeRegexp(pattern: string) : string {
        return pattern.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    /**
     * Create encoded query for usage in URL
     * @param params
     * @returns {string}
     */
    public static buildQueryString(params: Object) {
        return Object.keys(params)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
            .join('&');
    }
}