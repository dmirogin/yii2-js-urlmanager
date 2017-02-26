"use strict";
/// <reference path="../typings/globals/mocha/index.d.ts" />
var urlManager_1 = require('../urlManager');
var assert = require("assert");
describe('Rules', function () {
    var urlManager = new urlManager_1.UrlManager([
        {
            name: "/foo/<id:(\\d+)>/bar/<type:(first|second)>",
            route: "/foo/bar"
        },
    ]);
    it('should be corrected with params', function () {
        var rule = urlManager.createUrl('/foo/bar', {
            id: 7,
            type: "first"
        });
        assert.equal('/foo/7/bar/first', rule);
    });
});
//# sourceMappingURL=urlManager.test.js.map