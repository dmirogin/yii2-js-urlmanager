import {UrlRule} from '../../_assets/js/built/UrlRule';
import 'mocha';
import { should } from 'chai';
import { withData } from 'leche';

const assert = should();

describe('Rules', function() {
    withData({
        "params" : [
            {
                name: "/foo/<id:(\\d+)>/bar/<type:(first|second)>",
                route : "/foo/bar",
                params : {
                    id : 10,
                    type : "first"
                },
            },
            "/foo/10/bar/first"
        ],
        "empty params": [
            {
                name: "/foobarurl",
                route : "/foo/bar",
                params : {},
            },
            "/foobarurl"
        ],
        "invalid params": [
            {
                name: "/foo/<id:(\\d+)>/bar/<type:(first|second)>",
                route : "/foo/bar",
                params : {
                    id: 10,
                    type : "third"
                },
            },
            "/foo/bar?id=10&type=third"
        ],
    }, function(rule, expected) {
        it('should be corrected', function() {
            let urlRule = new UrlRule(rule.name, rule.route);
            assert.equal(expected, urlRule.createUrl(rule.route, rule.params));
        });
    });
});