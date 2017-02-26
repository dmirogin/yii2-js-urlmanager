"use strict";
var escapeRegexp = function (pattern) { return pattern.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); };
var UrlRule = (function () {
    function UrlRule(name, route) {
        this.name = name;
        this.route = route;
    }
    ;
    UrlRule.prototype.createUrl = function (route, urlParams) {
        if (route !== this.route) {
            return false;
        }
        var regexpGroups = /<([\w._-]+):?([^>]+)?>/g;
        var matches;
        var validParam = true;
        var validUrl = this.name;
        do {
            matches = regexpGroups.exec(this.name);
            if (matches) {
                var group = matches[2];
                var groupName = matches[1];
                var groupRegexp = new RegExp(escapeRegexp(group));
                if (!groupRegexp.test(urlParams[groupName])) {
                    validParam = false;
                }
                validUrl = validUrl.replace(new RegExp(escapeRegexp(matches[0])), urlParams[groupName]);
            }
        } while (matches);
        return validUrl;
    };
    return UrlRule;
}());
var UrlManager = (function () {
    function UrlManager(rules) {
        this.rules = this.buildRules(rules);
    }
    ;
    UrlManager.prototype.buildRules = function (rules) {
        var result = [];
        for (var _i = 0, rules_1 = rules; _i < rules_1.length; _i++) {
            var rule = rules_1[_i];
            result.push(new UrlRule(rule.name, rule.route));
        }
        return result;
    };
    ;
    UrlManager.prototype.createUrl = function (route, urlParams) {
        var result = route;
        for (var _i = 0, _a = this.rules; _i < _a.length; _i++) {
            var rule = _a[_i];
            var compiledRule = rule.createUrl(route, urlParams);
            if (compiledRule !== false) {
                return compiledRule;
            }
        }
        return result;
    };
    return UrlManager;
}());
exports.UrlManager = UrlManager;
//# sourceMappingURL=urlManager.js.map