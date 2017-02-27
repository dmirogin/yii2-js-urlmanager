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
}