/**
 * Escape string to use in regular expression
 * @param string
 * @returns {string}
 */
export function escapeRegexp (string : string) : string {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

/**
 * Build a query string from object
 * @param object
 * @returns {string}
 */
export function buildQueryString (object : Object) : string {
    return Object.keys(object)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(object[key]))
        .join('&');
}